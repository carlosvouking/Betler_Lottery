// rfce -- react functional component
import React, { useEffect, useState } from "react"
import NavButton from "./NavButton"
import Image from "next/image"
import {
    Bars3CenterLeftIcon,
    Bars4Icon,
    Bars3Icon,
    Bars3BottomLeftIcon,
} from "@heroicons/react/24/solid"
import { shortenAddress } from "../utils/shortenAddress"
import { ConnectButton, Web3Api } from "web3uikit"

import { useWeb3Contract } from "react-moralis"
import { contractAddresses, contractABI } from "../constants/constant_files"
import { useMoralis } from "react-moralis"
import { ethers } from "ethers"
import Marquee from "react-fast-marquee"
import { useNotification } from "web3uikit"
import { PropagateLoader } from "react-spinners"

function Header() {
    //const { enableWeb3, account, isWeb3Enabled, deactivateWeb3, user } = useMoralis()

    // Moralis knows about the current chainId coz the header passes all the infos about the metamask to the MoralisProvider
    //..and the MoralisProvider passes those infos down to the components inside the <MoralisProvider initializeOnMount={false}> tag
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [participationFee, setParticipationfee] = useState("0")
    const [numberParticipants, setNumberParticipants] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const [listParticipants, setListParticipants] = useState([])

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
        setListParticipants(listParticipantsFromCall) // set the list of participants
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
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <header className="grid grid-cols-2 md:grid-cols-5 justify-between items-center p-5">
            <div className="flex items-center space-x-3">
                {/* <div className="cursor-pointer text-amber-300 font-bold">
                    <Image priority src={ylogo} className="rounded-xl" />
                </div> */}
                <div className="flex flex-col">
                    <h1 className="text-yellow-500 text-lg font-bold text-center">
                        DECENTRALIZED RAPHL
                    </h1>
                    <span className="text-stone-300 text-sm text-center">
                        Fair - Transparent - Secure
                    </span>

                    {/* <p className="text-white text-sm ">
                        Connected folks:
                        <b className="text-yellow-200">{shortenAddress(account)}</b>
                    </p> */}
                    {/* <Marquee className="bg-[#1a1a0c]" gradient={false} speed={30}>
                        <div className="flex space-x-2 mx-10">
                            <h2 className="text-white text-sm">Fair - Transparent - Secure</h2>
                        </div>
                    </Marquee> */}
                    {/* <div className="ml-auto px-5">
                        <h2 className="text-white text-xs">
                            Fair, transparent and secure lottery
                        </h2>
                    </div> */}
                </div>
            </div>

            <div className="hidden items-center justify-center md:col-span-3 md:flex">
                <div className="bg-[text-yellow-50] p-4 space-x-2">
                    {/* <NavButton isActive title="Enter Lottery" /> */}
                    <button
                        //  disabled={expiration?.toString() < Date.now().toString() || remainingEntries?.toNumber() === 0}
                        className="disabled mt-5 w-full bg-gradient-to-br from-yellow-300 to-stone-800 px-10 py-5 font-semibold rounded-md text-xl
                      selection: text-white shadow-xl disabled:from-gray-500 disabled:to-gray-100 disabled:text-gray-100 
                      disabled:cursor-not-allowed md:hidden"
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
                            <div>Enter Lot</div>
                        )}
                    </button>
                    {/* <NavButton title="Disconnect Wallet" /> */}
                </div>
            </div>

            <div className="flex flex-col ml-auto text-right">
                {/* <Bars3BottomLeftIcon className="md:hidden w-8 h-8 mx-auto text-amber-400 cursor-pointer" /> */}
                <div className="ml-auto px-2">
                    <ConnectButton moralisAuth={false} />
                </div>
                <span className="">
                    {/* <NavButton title="Logout" /> */}
                    {/* <ConnectWallet /> */}
                    {/* <ConnectButton moralisAuth={false} /> */}
                </span>
            </div>
        </header>
    )
}

export default Header
