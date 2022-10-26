const { ethers } = require("hardhat")

const networkConfig = {
    // testnets with chainId
    5: {
        name: "goerli",
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        participationFee: ethers.utils.parseEther("0.01"), // 0.01 ETH
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // 30 gwei Key Hash
        subscriptionId: "4688",
        callbackGasLimit: "2500000", //2,500,000 on UI
        interval: "30",
    },

    31337: {
        name: "hardhat",
        //vrfCoordinatorV2: no need coz we are deployed i a mock here ,
        participationFee: ethers.utils.parseEther("0.01"), // 0.01 ETH
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", //
        subscriptionId: "588",
        callbackGasLimit: "500000",
        interval: "30",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = { networkConfig, developmentChains }
