// grab the development chains so that we only run unit tests on development chains
const { assert, expect } = require("chai")
const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

// we should be on developmentChains...no testnet
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Lottery Unit Tests", () => {
          // first deploy the lottery and the vrfCoordinatorV2Mock contracts
          let lottery, vrfCoordinatorV2Mock, deployer, lotteryParticipationFee, interval
          const chainId = network.config.chainId

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              lottery = await ethers.getContract("Lottery", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
              lotteryParticipationFee = await lottery.getParticipationFee()
              interval = await lottery.getInterval()
          })

          describe("constructor", () => {
              it("Initializes the lottery at start", async () => {
                  // lottery state is on state open- index 0
                  const lotteryState = await lottery.getLotteryState()

                  assert.equal(lotteryState.toString(), "0")
                  assert.equal(interval.toString(), networkConfig[chainId]["interval"])
              })
          })

          describe("enterLottery", () => {
              it("reverts if insufficient participation fees", async () => {
                  await expect(lottery.enterLottery()).to.be.revertedWith(
                      "Lottery__InsufficientParticipationFees"
                  )
              })

              it("registers participants entering the lottery", async () => {
                  await lottery.enterLottery({ value: lotteryParticipationFee })
                  const participantFromContract = await lottery.getParticipant(0)
                  assert.equal(participantFromContract, deployer)
              })

              it("emits an event on entering lottery", async () => {
                  await expect(lottery.enterLottery({ value: lotteryParticipationFee })).to.emit(
                      lottery,
                      "LotteryEnter"
                  )
              })

              it("should not allow participating if lottery is processing", async () => {
                  await lottery.enterLottery({ value: lotteryParticipationFee })
                  // for a documentation of the methods below, go here: https://hardhat.org/hardhat-network/reference
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", []) // mine 1 extra block
                  // pretending to be a keeper for a second to call performUpkeep
                  await lottery.performUpkeep([]) // changes the state of the Lottery to PROCESSING for our comparison below
                  await expect(
                      lottery.enterLottery({ value: lotteryParticipationFee })
                  ).to.be.revertedWith(
                      // it should be reverted as the statet is on PROCESSING
                      "Lottery__LotteryNotOpen"
                  )
              })
          })

          describe("requestRandomWinner", async () => {
              it("manually updates the lottery state, emits an event", async () => {
                  await lottery.enterLottery({ value: lotteryParticipationFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]) // fastforwarding interval for test
                  await network.provider.send("evm_mine", []) // adding a block
                  const transactionResponse = await lottery.performUpkeep([])
                  const transactionReceipt = await transactionResponse.wait(1)
                  const requestId = transactionReceipt.events[1].args.requestId // 2nd event  // RequestedLotteryWinner
                  const lotteryState = await lottery.getLotteryState()
                  assert(requestId.toNumber() > 0)
                  assert(lotteryState.toString() == "1")
              })
          })

          describe("checkUpkeep", () => {
              // test...hasBalance
              it("returns false if not enough ETH balance", async () => {
                  /* remember the reason we are fastforwarding a time and a block is bcoz we want checkUpkeep() to return 'upkeepNeeded as true',
                  ...instead of waiting for the interval. We are just testing here. No need to wait for 30 seconds to check the tests.*/
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]) // move a timestamp forward
                  await network.provider.send("evm_mine", []) // move a block forward
                  const { upkeepNeeded } = await lottery.callStatic.checkUpkeep([]) // simulate checkUpkeep transaction to return just upkeepNeeded which is false here
                  assert(!upkeepNeeded) // upkeepNeeded is true at this stage
              })

              // test...isLotteryOpen
              it("returns false if lottery is not open", async () => {
                  await lottery.enterLottery({ value: lotteryParticipationFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  await lottery.performUpkeep([]) // this turns lottery in a Processing state : "1"
                  const lotteryState = await lottery.getLotteryState() // processing
                  const { upkeepNeeded } = await lottery.callStatic.checkUpkeep([])
                  assert.equal(lotteryState.toString(), "1")
                  assert.equal(upkeepNeeded, false)
              })

              // test...elapsedTime
              it("returns false if enough time hasn't passed", async () => {
                  await lottery.enterLottery({ value: lotteryParticipationFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() - 5]) // use a higher number here if this test fails
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const { upkeepNeeded } = await lottery.callStatic.checkUpkeep("0x") //  upkeepNeeded = (isLotteryOpen && elapsedTime && hasParticipant_s && hasBalance)
                  assert(!upkeepNeeded) // not true
              })
              it("returns true if enough time has passed, has participants, eth, and is open", async () => {
                  await lottery.enterLottery({ value: lotteryParticipationFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const { upkeepNeeded } = await lottery.callStatic.checkUpkeep("0x") // //  upkeepNeeded = (isLotteryOpen && elapsedTime && hasParticipant_s && hasBalance)
                  assert(upkeepNeeded) // upkeepNeeded is true
              })
          })

          describe("performUpkeep", () => {
              // test...bool upkeepNeeded
              it("executes if upkeepNeeded is true", async () => {
                  await lottery.enterLottery({ value: lotteryParticipationFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const transaction = await lottery.performUpkeep("0x") // if no error ie: performUpkeep() ran correctly (upkeepNeeded is tru here) then tx runs smoothly
                  assert(transaction)
              })

              // test...revert Lottery__CheckUpkeepFailed
              it("reverts if checkUpKeep returns false", async () => {
                  await expect(lottery.performUpkeep([])).to.be.revertedWith(
                      "Lottery__CheckUpkeepFailed"
                  )
              })

              it("updates the lottery state, emits an event and invoke the vrf coordinator", async () => {
                  await lottery.enterLottery({ value: lotteryParticipationFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]) // fastforwarding interval for test
                  await network.provider.send("evm_mine", []) // adding a block
                  const transactionResponse = await lottery.performUpkeep([])
                  const transactionReceipt = await transactionResponse.wait(1)
                  const requestId = transactionReceipt.events[1].args.requestId // 2nd event  // RequestedLotteryWinner
                  const lotteryState = await lottery.getLotteryState()
                  assert(requestId.toNumber() > 0)
                  assert(lotteryState.toString() == "1")
              })
          })

          describe("fulfillRandomWords", () => {
              // before doing a test on 'fulfillRandomWords', someone has to enter the lottery, the time increased and a new block mined
              beforeEach(async () => {
                  await lottery.enterLottery({ value: lotteryParticipationFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
              })
              // test...on requestId existance...perofrmUpkeep / requestRandomWords generates a requestId
              it("can only be called after performUpkeep", async () => {
                  // revert on some request that don't exist...check on the VRFCoordinatorV2Mock
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(0, lottery.address)
                  ).to.be.revertedWith("nonexistent request")
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(1, lottery.address)
                  ).to.be.revertedWith("nonexistent request")
              })

              // test...on randomWinner, lotteryState, transfer funds
              it("picks a winner, reset the lottery, and transfer money to winner", async () => {
                  // adding additional participants (some fake accounts from ethers) to the lottery
                  const additionalParticipants = 3
                  const startingAccountIndex = 1 // set the new fake accounts starting at index 1 --- deployer is at index 0
                  const accounts = await ethers.getSigners()

                  for (
                      let i = startingAccountIndex;
                      i < startingAccountIndex + additionalParticipants;
                      i++
                  ) {
                      // connect the fake accounts to the lottery contract so they can participate
                      const accountConnectedLottery = lottery.connect(accounts[i])
                      await accountConnectedLottery.enterLottery({ value: lotteryParticipationFee })
                  } // . . . at this point we have 4 participants in the lottery

                  // keep note of the starting timestamp
                  const startingTimeStamp = await lottery.getLatestTimeStamp()

                  // here is 2 things to do here:
                  // 1- call performUpkeep to immitate or behave as the automation keepers,
                  // 2- the keepers will then kick-off fulfillRandomWords which will in its turn immitate or mock beng the VRF
                  //  On a testnet: we will have to wait for the 'fulfillandomWords' to be invoked
                  //  On a localhost or default hardhat: no need to wait for anything..but wait for the 'randomWinnerPicked' event to be called
                  //   ... we need to have a listener (as a promise) which listens so that once the a winner is picked
                  // Also before the vents gets fired, 'performUpkeep' and 'fulfillRandomWords' should be called
                  await new Promise(async (resolve, reject) => {
                      //setting up a listener to the randomWinnerPicked event
                      lottery.once("RandomWinnerPicked", async () => {
                          console.log("Yéééh, event found -- a random winner is picked")
                          try {
                              const recentRandomWinner = await lottery.getRecentRandomWinner()
                              // print our recent winner
                              console.log("winner:", recentRandomWinner)
                              console.log("----------*----------------*-----------------*")
                              // print participants addresses
                              console.log(accounts[2].address)
                              console.log(accounts[0].address)
                              console.log(accounts[1].address)
                              console.log(accounts[3].address)

                              const lotteryState = await lottery.getLotteryState()
                              const endingTimeStamp = await lottery.getLatestTimeStamp()
                              const numberParticipants = await lottery.getNumberOfParticipants()
                              assert.equal(numberParticipants.toString(), "0") // no participants at this stage
                              assert.equal(lotteryState.toString(), "0") //lottery state reset to index 0 (OPEN)
                              assert(endingTimeStamp > startingTimeStamp)
                          } catch (e) {
                              reject(e) // takes more than 300 seconds ... rejects the promise
                          }
                          resolve() // resolve the promise if try passes
                      })

                      // kick-off the RandomWinnerPicked event Mocking the chainlink keeper automation
                      const transaction = await lottery.performUpkeep("0x")
                      const transactionReceipt = transaction.wait(1)

                      //Kick-off the RandomWinnerPicked event Mocking the chainlink VRF
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          transactionReceipt.events[1].args.requestId,
                          lottery.address
                      )
                  })
              })
          })
      })
