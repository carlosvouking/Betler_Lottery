import React, { useEffect, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { contractAddresses, contractABI, networkExtraData } from "../constants/constant_files"
import { useMoralis } from "react-moralis"
import { ethers } from "ethers"
import Marquee from "react-fast-marquee"
import { useNotification } from "web3uikit"
import { PropagateLoader } from "react-spinners"

function RaffleEntrance() {
    const [quantity, setQuantity] = useState("0")

    // Moralis knows about the current chainId coz the header passes all the infos about the metamask to the MoralisProvider
    //..and the MoralisProvider passes those infos down to the components inside the <MoralisProvider initializeOnMount={false}> tag
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const networkName = chainId in networkExtraData ? networkExtraData[chainId][0] : null

    const [participationFee, setParticipationfee] = useState("0")
    const [numberParticipants, setNumberParticipants] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const [participants, setParticipants] = useState([])

    const dispatch = useNotification()

    // make 'enterLottery()'  available to Frontend
    const {
        runContractFunction: enterLottery,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: contractABI, // does not really change per network or blockchain...can be hardcoded
        contractAddress: lotteryAddress, // address of the deployed contract which doesn't really change.
        functionName: "enterLottery",
        params: {},
        msgValue: participationFee,
    })

    // make 'getParticipationFee()'  available to Frontend
    const { runContractFunction: getParticipationFee } = useWeb3Contract({
        abi: contractABI, // does not really change per network or blockchain...can be hardcoded
        contractAddress: lotteryAddress, // address of the deployed contract which doesn't really change.
        functionName: "getParticipationFee",
        params: {},
    })

    // make list of participants available to Frontend
    const { runContractFunction: getParticipants } = useWeb3Contract({
        abi: contractABI, // does not really change per network or blockchain...can be hardcoded
        contractAddress: lotteryAddress, // address of the deployed contract which doesn't really change.
        functionName: "getParticipants",
        params: {},
    })

    // make 'getNumberOfParticipants()'  available to Frontend
    const { runContractFunction: getNumberOfParticipants } = useWeb3Contract({
        abi: contractABI, // does not really change per network or blockchain...can be hardcoded
        contractAddress: lotteryAddress, // address of the deployed contract which doesn't really change.
        functionName: "getNumberOfParticipants",
        params: {},
    })

    // make 'getRecentRandomWinner()'  available to Frontend
    const { runContractFunction: getRecentRandomWinner } = useWeb3Contract({
        abi: contractABI, // does not really change per network or blockchain...can be hardcoded
        contractAddress: lotteryAddress, // address of the deployed contract which doesn't really change.
        functionName: "getRecentRandomWinner",
        params: {},
    })

    async function updateContractDataOnUI() {
        const participationFeeFromCall = (await getParticipationFee()).toString()
        const numberParticipantsFromCall = (await getNumberOfParticipants()).toString()
        const recentWinnerFromCall = (await getRecentRandomWinner()).toString()
        const listParticipantsFromCall = (await getParticipants()).toString()

        setParticipationfee(participationFeeFromCall) //raw  fee value saved on the backend
        setNumberParticipants(numberParticipantsFromCall)
        setRecentWinner(recentWinnerFromCall)
        setParticipants(listParticipantsFromCall) // set the list of participants
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateContractDataOnUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (transaction) => {
        await transaction.wait(1)
        handleNewNotification(transaction)
        updateContractDataOnUI()
    }

    const handleNewNotification = () => {
        dispatch({
            type: "success",
            message: "Successfully entered the Lottery",
            title: "Enter Lottery",
            position: "bottomL",
            //icon: "bell",
        })
    }

    // const listParticipantsInRow = function displayAccounstInRow() {
    //     for (let i = 0; i < listParticipants.length; i++) {
    //         console.log(listParticipants[i])
    //     }
    // }

    return (
        <div className="raffleStats-wrapper flex flex-col">
            {/* raffle entrance */}
            <h2 className="text-white text-left text-sm italic">
                Current Network: <span className="text-amber-200 text-sm">{networkName}</span>
            </h2>
            <div className="raffleStats-wrapper space-y-2 ">
                <div className="raffleStats-wrapper">
                    <div className="flex justify-between items-center text-white pb-2">
                        <h2 className="text-center">Participation</h2>
                        <p className="">
                            {/* {entryPrice && ethers.utils.formatEther(entryPrice?.toString())}{" "} ETH */}
                        </p>
                    </div>
                    <div className="flex text-white items-center space-x-2 bg-[#22220f] border-[#2d3533] border p-3">
                        <p>Entries</p>
                        <input
                            type="number"
                            className="flex w-full bg-transparent text-right outline-none"
                            min={1}
                            max={2}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>

                    <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between text-gray-400 text-sm italic font-extrabold">
                            <p>Total participation Price</p>
                            <p>
                                {ethers.utils.formatUnits(participationFee)} ETH
                                {/* {entryPrice && Number(ether.util.formatEther(entryPrice.toString())) * quantity}{" "} ETH */}
                            </p>
                        </div>
                        {lotteryAddress ? (
                            <div className="flex items-center justify-between text-gray-400 text-xs italic">
                                <p className="ml-3">Service fees</p>
                                <p>{ethers.utils.formatUnits(participationFee)} ETH</p>
                            </div>
                        ) : (
                            <div>
                                {
                                    // <p className="ml-3 text-red-400 text-sm italic text-center">
                                    //     No Lottery Address detected - Network not supported
                                    // </p>
                                }
                                {
                                    <Marquee className="bg-[#292919]" gradient={false} speed={40}>
                                        <p className="ml-3 text-amber-700 text-sm italic text-center font-bold">
                                            No Lottery Address detected - network not supported
                                        </p>
                                    </Marquee>
                                }
                            </div>
                        )}

                        <div className="flex items-center justify-between text-gray-400 text-xs italic">
                            <p className="ml-3">
                                + Network({" "}
                                <span className="text-amber-200 text-sm">{networkName}</span> ) -
                                Gas Fees
                            </p>
                            <p>{} ETH</p>
                        </div>
                        <div className="flex items-center justify-between text-gray-400 text-xs italic">
                            <p className="ml-3">+ Miscellaneous</p>
                            <p>{} ETH</p>
                        </div>
                    </div>

                    <button
                        //  disabled={expiration?.toString() < Date.now().toString() || remainingEntries?.toNumber() === 0}
                        className="disabled mt-5 w-full bg-gradient-to-br from-yellow-300 to-stone-800 px-10 py-4 font-semibold rounded-md text-xl
                                      selection: text-white shadow-xl disabled:from-gray-500 disabled:to-gray-100 disabled:text-gray-100 
                                      disabled:cursor-not-allowed "
                        onClick={async () => {
                            await enterLottery({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            // <div className="animate-spin spinner-border h-12 w-12 border-b-2 rounded-full"></div>
                            <div className="mb-6">
                                <PropagateLoader size="30" color="#ca8a04" />
                            </div>
                        ) : (
                            <div>Enter Lottery</div>
                        )}
                    </button>
                </div>
            </div>

            {/* Next pick */}
            <div className="raffleStats-wrapper border mt-5">
                <div className="flex justify-between p-2 space-x-2">
                    <div className="raffleStats">
                        <h2 className="text-sm">Currently Paricipating</h2>
                        <p className="text-xl">{numberParticipants}</p>
                    </div>
                    <div className="raffleStats">
                        <h2 className="text-sm">Remaining </h2>
                        {/* <p className="text-xl">{remainingEntries?.toNumber()}</p>    */}
                    </div>
                </div>

                {/* clock ticking */}
                {/* <div className="mt-5 mb-3">
                <CountdownTimer />
            </div> */}
                <div className="flex justify-between p-2 space-x-2">
                    <div className="raffleStats">
                        <h2 className="text-sm">Particpants Accounts</h2>
                        <p className="text-sm">{participants}</p>
                    </div>
                </div>
                <h1 className="text-3xl text-yellow-200 font-semibold text-center">Next Pick</h1>
                <div className="flex justify-between p-2 space-x-2">
                    <div className="raffleStats">
                        <h2 className="text-sm">Recent Winner</h2>
                        <div className="text-sm">{recentWinner}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RaffleEntrance
