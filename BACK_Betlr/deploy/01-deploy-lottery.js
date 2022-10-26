const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("5") // 5 Ether, or 5e18 (10^18) Wei

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { log, deploy } = deployments
    const chainId = network.config.chainId
    // 1rst argument in constructor
    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock

    // if on develpment chains, deploy mock and save the address of the deployed mock contract...31337
    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const txnResponse = await vrfCoordinatorV2Mock.createSubscription() // on local chains
        const txnReceipt = await txnResponse.wait(1)
        subscriptionId = txnReceipt.events[0].args.subId // the txn Receipt has an event that is emitted with the subscriptionId
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT) // fund the subscription on the mock without LINK token

        // and if on testnets...
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    log("----------------------------------------------------")

    const arguments = [
        vrfCoordinatorV2Address,
        networkConfig[chainId]["participationFee"],
        networkConfig[chainId]["gasLane"],
        subscriptionId,
        networkConfig[chainId]["callbackGasLimit"],
        networkConfig[chainId]["interval"],
    ]

    // actually deploying here...
    const lottery = await deploy("Lottery", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (chainId == 31337) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId.toNumber(), lottery.address)
        log("adding consumer...")
        log("Consumer added!")
    }

    // Verifying the contract on ETherscan
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying contract...")
        await verify(lottery.address, arguments)
    }

    log("Enter lottery with command:")
    const networkName = network.name == "hardhat" ? "localhost" : network.name
    log(` yarn hardhat run scripts/enterLottery.js --network ${networkName}`)
    log("--------------*---------------*-----------------*---------------*----------------")
    log("")
}

module.exports.tags = ["all", "lottery"]
