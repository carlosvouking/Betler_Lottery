/**
 * Goal: This script is connected to the front end 'RaffleEntrance.tsx'
 * This will serve in updating the contractAdress, abi, params etc...on the front UI depending on the operating network (local or testnet)
 *  So after we deploy our main contract (00-deploy-mocks en 01-deploy-lottery),
 *  this script creates the '../constant/contractABI.json' , '../contractAddresses.json' for us with other params we might need form Backend to the Frontend.
 *  // no need to deploy any contract here...the ultimate goal is to update the front end depending on the blockchain we are on.
    // Since we are not updating the frontend all the time, the update will be driven by a .env variable : 'UPDATE_FRONT_END' = true or false
    // a litte 'hh node' or 'hh deploy' is going to run all the scripts in /deploy folder (00-deploy-mocks -- 01-deploy-lottery -- 100-update-frontend)
    //... our Frontend '../constant/contractABI.json' , '../contractAddresses.json' files wil be automatically populated / updates from the Backend
 */

const { ethers, network } = require("hardhat")
const fs = require("fs")

const FRONT_END_ADDRESSES_FILE = "../betlr/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../betlr/constants/contractABI.json"

module.exports = async () => {
    const UPDATE_FRONT_END = process.env.UPDATE_FRONT_END
    if (UPDATE_FRONT_END) {
        console.log("Front end is updating . . .")
        console.log("--------------*---------------*-----------------*---------------")
        updateContractAdress()
        updateContractAbi()
    }
}

const updateContractAdress = async () => {
    // change or updating the contract address in the ../constants/contractAddresses
    const lottery = await ethers.getContract("Lottery")
    // read the content of the frontend contractAdresses.JSON
    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))
    // keep track of all different adresses accross all different networks
    const chainId = network.config.chainId.toString()
    if (chainId in currentAddresses) {
        // if there is chainId wihtout address, add the new contract address
        if (!currentAddresses[chainId].includes(lottery.address)) {
            currentAddresses[chainId].push(lottery.address)
        }
    } else {
        // no chaindId ? add new array of addresses
        currentAddresses[chainId] = [lottery.address]
    }
    // write the updated addresses back to the frontend address file
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))

    console.log(` ** Current addresses : ${currentAddresses[chainId]}`)
    console.log("    - Front end contract addresses updated !")
    console.log("--------------*---------------*-----------------*---------------")
}

const updateContractAbi = async () => {
    const lottery = await ethers.getContract("Lottery")
    const contractAbi = lottery.interface.format(ethers.utils.FormatTypes.json) //contract.interface from ethers docs'
    // write the updated abi back to the frontend Abi file
    fs.writeFileSync(FRONT_END_ABI_FILE, contractAbi)

    console.log(` ** Contract Abi: ${contractAbi}`)
    console.log("    - Front end contract Abi updated")
    console.log("--------------*---------------*-----------------*---------------")
}

module.exports.tags = ["all", "frontend"]
