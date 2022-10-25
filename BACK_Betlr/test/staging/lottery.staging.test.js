const { assert, expect } = require("chai")
const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

// we should be on testnets...no developmentChains
developmentChains.includes(network.name)
    ? describe.skip
    : describe("Lottery Staging Tests", () => {
          // first deploy the lottery and the vrfCoordinatorV2Mock contracts
          let lottery, lotteryParticipationFee, deployer

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              lottery = await ethers.getContract("Lottery", deployer)
              lotteryParticipationFee = await lottery.getParticipationFee()
          })

          describe("fulfillRandomWords", async () => {
              it("works with live Chainlink automation - keepers and Chainlink VRF in getting a random winner", async () => {
                  // enter the lottery
                  const startingTimeStamp = lottery.getLatestTimeStamp()
                  const accounts = ethers.getSigners()

                  // setup listener before entering Lottery..just in case the blockchain is FAST
                  await new Promise(async (resolve, reject) => {
                      lottery.once("RandomWinnerPicked", async () => {
                          console.log("Winner picked, event fired !")
                          try {
                              const randomRecentWinner = lottery.getRecentRandomWinner()
                              const lotteryState = lottery.getLotteryState()
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await lottery.getLatestTimeStamp()

                              await expect(lottery.getParticipant(0)).to.be.reverted
                              assert.equal(randomRecentWinner, accounts[0].address) // deployer at account[0]
                              assert.equal(lotteryState, 0)
                              assert.equal(
                                  winnerEndingBalance,
                                  winnerStartingBalance.add(lotteryParticipationFee).toString()
                              )
                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (error) {
                              console.log(error)
                              reject(error)
                          }
                      })
                      // then enter the lottery
                      console.log("Entering the lottery . . .")
                      const txn = await lottery.enterLottery({ value: lotteryParticipationFee })
                      await txn.wait(1)
                      console.log("All right, let's wait a bit . . . ")
                      const winnerStartingBalance = await accounts[0].getBalance()

                      // this below will not complete until the listener has finished listening...
                  })
              })
          })
      })
