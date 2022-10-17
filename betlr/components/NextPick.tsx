import React from "react"
import CountdownTimer from "react-countdown"

function NextPick() {
    return (
        <div className="raffleStats-wrapper">
            <h1 className="text-4xl text-yellow-200 font-semibold text-center">Next Pick</h1>
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
            {/* <div className="mt-5 mb-3">
                <CountdownTimer />
            </div> */}
        </div>
    )
}

export default NextPick
