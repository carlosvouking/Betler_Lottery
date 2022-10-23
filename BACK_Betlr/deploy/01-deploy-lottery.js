const { network, ethers } = require("hardhat")
const { verify } = require("../hardhat.config")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("5")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { log, deploy } = deployments
    const chainId = network.config.chainId
    // 1rst argument in constructor
    let vrfCoordinatorV2Address, subscriptionId

    // if on develpment chains, deploy mock and save the address of the deployed mock contract
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

    // 2nd argument in constructor
    const participationFee = networkConfig[chainId]["participationFee"]

    // 3rd argument in contructor
    const gasLane = networkConfig[chainId]["gasLane"]

    //4th argumrnt in constructor  -- subscriptionId

    // 5th argument  in constructor
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]

    // last argument in contructor
    const interval = networkConfig[chainId]["interval"]

    const arguments = [
        vrfCoordinatorV2Address,
        participationFee,
        gasLane,
        subscriptionId,
        callbackGasLimit,
        interval,
    ]

    const lottery = await deploy("Lottery", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verifying the contract on ETherscan
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying contract...")
        await verify(lottery.address, args)
    }

    log(
        "-------------------*---------------------*--------------------*-------------------*---------------------*--------------------"
    )
    log("")
}

module.exports.tags = ["all", "lottery"]
