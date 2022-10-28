import React, { useEffect, useState, useCallback } from "react"
import CountdownTimer from "react-countdown"
import { contractAddresses, contractABI } from "../constants/constant_files"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import { shortenAddress } from "../utils/shortenAddress"

function NextPick() {
    // Moralis knows about the current chainId coz the header passes all the infos about the metamask to the MoralisProvider
    //..and the MoralisProvider passes those infos down to the components inside the <MoralisProvider initializeOnMount={false}> tag
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [listParticipants, setListParticipants] = useState([])
    const [numberParticipants, setNumberParticipants] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

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
        const listParticipantsFromCall = (await getParticipants()).toString()
        const numberParticipantsFromCall = (await getNumberOfParticipants()).toString()
        const recentWinnerFromCall = (await getRecentRandomWinner()).toString()

        setNumberParticipants(numberParticipantsFromCall)
        setListParticipants(listParticipantsFromCall) // set the list of participants
        setRecentWinner(recentWinnerFromCall)
    }

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
            icon: "",
        })
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateContractDataOnUI()
        }
    }, [isWeb3Enabled])

    return (
        <div className="raffleStats-wrapper">
            <h1 className="text-3xl text-yellow-200 font-semibold text-center">Next Pick</h1>
            <div className="flex justify-between p-2 space-x-2">
                <div className="raffleStats">
                    <h2 className="text-sm">Total particpants</h2>
                    <p className="text-xl">{numberParticipants}</p>
                </div>
                <div className="raffleStats">
                    <h2 className="text-sm">Remaining participations</h2>
                    {/* <p className="text-xl">{remainingEntries?.toNumber()}</p>    */}
                </div>
            </div>
            {/* clock ticking */}
            {/* <div className="mt-5 mb-3">
                <CountdownTimer />
            </div> */}
            <div className="flex justify-between p-2 space-x-2">
                <div className="raffleStats">
                    <h2 className="text-sm">Recent Winner</h2>
                    <div className="text-sm">{recentWinner}</div>
                </div>
            </div>
            {/* <div className="flex justify-between p-2 space-x-2">
                <div className="raffleStats">
                    <h2 className="text-sm">List Particpants</h2>
                    <div className="text-sm">{listParticipants}</div>
                </div>
            </div> */}
        </div>
    )
}

export default NextPick
