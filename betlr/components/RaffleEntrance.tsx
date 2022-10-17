import React from "react"
import { useState } from "react"
//import { useWeb3Contract } from "react-moralis"

function RaffleEntrance() {
    const [quantity, setQuantity] = useState<number>(1)

    // const { runContractFunction: EnterLottery } = useWeb3Contract({
    //     // abi: ,
    //     // contractAddress:
    //     // functionName:
    //     // params: {},
    //     // masgValue
    // })

    return (
        <div className="raffleStats-wrapper space-y-2">
            <div className="raffleStats-wrapper">
                <div className="flex justify-between items-center text-white pb-2">
                    <h2 className="">Cost per entry</h2>
                    <p className="">
                        {/* {entryPrice && ethers.utils.formatEther(entryPrice?.toString())}{" "} ETH */}
                    </p>
                </div>
                <div className="flex text-white items-center space-x-2 bg-[#22220f] border-[#2d3533] border p-3">
                    <p>PARTICIPATIONS</p>
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
                    className="disabled mt-5 w-full bg-gradient-to-br from-amber-400 to-stone-900 px-10 py-5 font-semibold rounded-md text-xl
                                      selection: text-white shadow-xl disabled:from-gray-500 disabled:to-gray-100 disabled:text-gray-100 
                                      disabled:cursor-not-allowed"
                    // onClick={handleParticipation}
                >
                    Into The Raphl
                </button>
            </div>
        </div>
    )
}

export default RaffleEntrance
