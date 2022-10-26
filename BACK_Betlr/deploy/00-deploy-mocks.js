const { network } = require("hardhat")
const { getNamedAccounts, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE = "250000000000000000" //ethers.utils.parseEther("0.25") // 0.25 LINK base price (or oracle gas) for every random number request
const GAS_PRICE_LINK = 1e9 // 1 000 000 000 -- link per gas...calculated based on the gas price

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const arguments = [BASE_FEE, GAS_PRICE_LINK]

    // we only deploy mocks if we are on development chains: localhost or 'default hardhat'
    if (developmentChains.includes(network.name)) {
        log("")
        log(" --> Local development chain was detected --> Now deploying mocks !")
        // then we deploy a mock or a copy vrfCoordinator...but where do we get a mock for vrfCoordinator ?
        // ... from v0.8/mocks/VRFCoordinatorV2Mock.sol
        await deploy("VRFCoordinatorV2Mock", {
            contract: "VRFCoordinatorV2Mock",
            from: deployer,
            args: arguments, // look over to the constructor to get the arguments...
            log: true,
        })
        log("Mocks are deployed")
        log(
            "-------------------*---------------------*--------------------*-------------------*---------------------*--------------------"
        )
        log("")
    }
}

module.exports.tags = ["all", "mocks"]
