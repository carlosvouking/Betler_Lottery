import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { PropagateLoader } from "react-spinners"
import { ethers } from "ethers"

import Header from "../components/Header"
import ylogo from "../images/Y_logo.png"
import Login from "../components/Login"
import CountdownTimer from "../components/CountdownTimer"
//import toast from "react-hot-toast"
import Marquee from "react-fast-marquee"
import AdminControls from "../components/AdminControls"

const Home: NextPage = () => {
    const { enableWeb3, account, isWeb3Enabled, isWeb3EnableLoading } = useMoralis()
    const [quantity, setQuantity] = useState<number>(1)

    //const {data: remainingEntries } = useContractData(deployedContract, "RemainingEntries")
    //const {data: currentWinnigReward} = useContractData(deployedContract, "CurrentWinningReward")
    //const {data: entryPrice} = useContractData(deployedContract, "entryPrice")
    //const {data: entryCommission} = useContract(deployedContract, "entryCommission")
    //const {data: expiration} = useContract(deployedContract, "expiration")
    //const { muteAsync: EnterLottery} useContractCall(deployedContract, "EnterLottery")
    //const {data: lastWinner} = useContractData(deployedContract, "lastWinner")
    //const {data: lastWinnerAmount } = useContractData(deployedContract, "lastWinnerAmount")
    //const {data, isRaffleOperator} = useContractData(deployedContract, "isRaffleOperator")

    const handleParticipation = async () => {
        const entryPrice = 0.01 // normally it should comme from the sol contract...
        if (!entryPrice) return

        //const entryNotification = toast.loading("Entering the lottery....")

        try {
            //const data = await EnterLottery([ {value: ethers.utils.parseEther(Number(ethers.utils.formatEther(entryPrice))*quantity).toString()),},])
            // toast.success("Successfully enterd the lottery !", {
            //     id: entryNotification,
            // })
            // console.info("contract called successfully", data)
        } catch (err) {
            // toast.error("Aïyayaïii, something went wrong !", {
            //     id: entryNotification,
            // })

            console.error("contract call failure !", err)
        }
    }

    // useEffect(() => {
    //     if (isWeb3Enabled) {
    //         // if already connected to web3, do nothing
    //         return
    //     } else {
    //         //enableWeb3() // if not connected then connect
    //     }
    // }, [isWeb3Enabled])

    return (
        <div className="bg-[#1a1a0c] min-h-screen flex flex-col">
            <Head>
                <title>Decent Lottery</title>
                {/* <link rel="icon" href="favicon" /> */}
            </Head>

            <div className="flex-1">
                {account ? <Header /> : <Login />}

                <Marquee className="bg-[#292919]" gradient={false} speed={80}>
                    <div className="flex space-x-2 mx-10">
                        <h4 className="text-stone-400 font-bold">
                            Last winner: ...{/* {lastWinner} */}
                        </h4>
                        <h4 className="text-stone-400 font-bold">
                            Previous winning: ...{/* {lastWinnerAmount} */}
                        </h4>
                    </div>
                </Marquee>

                {/* {isRaffleOperator === address && ( */}
                {account ? (
                    <div className="flex justify-center mt-5">
                        <AdminControls />
                    </div>
                ) : (
                    <div><h3>Admin control deactivated</h3></div>
                )}
                {/* )} */}

                {/* <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">
                    <button className="p-5 bg-gradient-to-tr from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full">
                        <p className="font-bold">Winner winner</p>
                        <p>Total earned: 0.0018 ETH</p>
                        <br />
                        <p className="font-semibold">Withdraw your earnings here</p>
                    </button>
                </div> */}

                <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5">
                    <div className="raffleStats-wrapper">
                        <h1 className="text-4xl text-yellow-200 font-semibold text-center">
                            Next Pick
                        </h1>
                        <div className="flex justify-between p-2 space-x-2">
                            <div className="raffleStats">
                                <h2 className="text-sm">Total pool</h2>
                                <p className="text-xl">
                                    {/* {currentWinnigReward && ethers.utils.formatEther(currentWinnigReward?.toString())}{" "} ETH */}
                                </p>
                            </div>
                            <div className="raffleStats">
                                <h2 className="text-sm">Remaining participations</h2>
                                {/* <p className="text-xl">{remainingEntries?.toNumber()}</p>    */}
                            </div>
                        </div>
                        {/* clock ticking */}
                        <div className="mt-5 mb-3">
                            <CountdownTimer />
                        </div>
                    </div>

                    <div className="raffleStats-wrapper space-y-2">
                        <div className="raffleStats-wrapper">
                            <div className="flex justify-between items-center text-white pb-2">
                                <h2 className="">Price per entry</h2>
                                <p className="">
                                    {/* {entryPrice && ethers.utils.formatEther(entryPrice?.toString())}{" "} ETH */}
                                </p>
                            </div>
                            <div className="flex text-white items-center space-x-2 bg-[#22220f] border-[#4e5755] border p-3">
                                <p>TICKETS</p>
                                <input
                                    type="number"
                                    className="flex w-full bg-transparent text-right outline-none"
                                    min={1}
                                    max={5}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2 mt-2">
                                <div className="flex items-center justify-between text-gray-400 text-sm italic font-extrabold">
                                    <p>Total fees of participation</p>
                                    <p>
                                        {/* {entryPrice && Number(ether.util.formatEther(entryPrice.toString())) * quantity}{" "} ETH */}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-gray-400 text-xs italic">
                                    <p className="ml-3">Service fees</p>
                                    <p>
                                        {/* {entryCommission && ethers.utils.formatEther(entryCommission?.toString())}{" "} */}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-gray-400 text-xs italic">
                                    <p className="ml-3">+ Network Fees</p>
                                    <p>TBC</p>
                                </div>
                            </div>

                            <button
                                //  disabled={expiration?.toString() < Date.now().toString() || remainingEntries?.toNumber() === 0}
                                className="disabled mt-5 w-full bg-gradient-to-br from-yellow-500 to-emerald-00 px-10 py-5 font-semibold rounded-md text-xl
                                      selection: text-white shadow-xl disabled:from-gray-500 disabled:to-gray-100 disabled:text-gray-100 
                                      disabled:cursor-not-allowed"
                                // onClick={handleParticipation}
                            >
                                Enter the lottery
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
