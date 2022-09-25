import React from "react"
import toast from "react-hot-toast"

import {
    StarIcon,
    CurrencyDollarIcon,
    ArrowPathIcon,
    ArrowUturnLeftIcon,
    ArrowDownOnSquareStackIcon,
    ArrowUturnDownIcon,
    ArrowUturnUpIcon,
} from "@heroicons/react/24/solid"

function AdminControls() {
    //const {deployedContract, isLoading} = useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS)

    // const {data: totalCommission} = useContractData(
    //     deployedContract, "raffleOperatorTotalCommission"
    // )

    // const {muteAsync: PickWinner} = useContractCall(deployedContract, "PickWinner")
    // const {muteAsync: WithDrawCommission} = useContractCall(deployedContract, "WithDrawCommission")
    // const {muteAsync: RestartPicking} = useContractCall(deployedContract, "RestartPicking")
    // const {muteAsync: RefundEveryone} = useContractCall(deployedContract, "RefundEveryone")

    const pickWinner = async () => {
        const notification = toast.loading("Picking a winner...")

        try {
        } catch (error) {}
    }

    return (
        <div className="text-white text-center px-5 py-3 rounded-md border-green-300/20 border">
            <h2 className="font-bold">Raffle Admin controls</h2>
            <p className="mb-5">
                Raffle Operator Total commissions :{" "}
                {/* {raffleOperatorTotalCommission && 
                ethers.utils.formatEther(raffleOperatorTotalCommission?.toString())}{" "} ETH */}
            </p>
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <button className="admin-button">
                    <StarIcon className="h-6 mx-auto mb-2" />
                    Pick Winner
                </button>
                <button className="admin-button">
                    <CurrencyDollarIcon className="h-6 mx-auto mb-2" />
                    Withdraw commission
                </button>
                <button className="admin-button">
                    <ArrowPathIcon className="h-6 mx-auto mb-2" />
                    Restart Picking
                </button>
                <button className="admin-button">
                    <ArrowUturnUpIcon className="h-6 mx-auto mb-2" />
                    Refund Everyone
                </button>
            </div>
        </div>
    )
}

export default AdminControls
