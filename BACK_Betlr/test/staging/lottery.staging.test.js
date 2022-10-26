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
                  // entering the lottery
                  const startingTimeStamp = lottery.getLatestTimeStamp()
                  const accounts = ethers.getSigners()

                  // setup listener before entering Lottery..just in case the blockchain is FAST
                  await new Promise(async (resolve, reject) => {
                      // setup listener before we enter the raffle
                      // Just in case the blockchain moves REALLY fast
                      lottery.once("RandomWinnerPicked", async () => {
                          console.log("RandomWinnerPicked event fired!")
                          try {
                              // add our asserts here
                              const recentWinner = await lottery.getRecentRandomWinner()
                              const lotteryState = await lottery.getLotteryState()
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await lottery.getLatestTimeStamp()

                              await expect(lottery.getParticipant(0)).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(lotteryState, 0)
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(lotteryParticipationFee).toString()
                              )
                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (error) {
                              console.log(error)
                              reject(error)
                          }
                      })
                      // then we enter the lottery
                      console.log("Entering the lottery...")
                      const tx = await lottery.enterLottery({ value: lotteryParticipationFee })
                      await tx.wait(1)
                      console.log("Ok, let's wait a little...")
                      const winnerStartingBalance = await accounts[0].getBalance()

                      // and this code WONT complete until our listener has finished listening!
                  })
              })
          })
      })
