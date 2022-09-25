import React from "react"
import Countdown from "react-countdown"

type Props = {
    hours: number
    minutes: number
    seconds: number
    completed: boolean
}

function CountdownTimer() {
    // const {deployedContract} = useContract(process.env.LOTTERY_CONTRACT_ADDRESS)
    // const {data: expiration, isLoading: isLoadingExpiration} = useContractData(deployedContract, "expiration")
    const lotteryDuration = 3600000
    const expiration = lotteryDuration //block.timestamp + ;

    const renderer = ({ hours, minutes, seconds, completed }: Props) => {
        if (false)
            // if (completed)
            return (
                <div>
                    <h2 className="countdown-completed-label">
                        Participation is currently closed for this raffle draw.
                    </h2>

                    <div className="flex space-x-6">
                    <div className="flex-1">
                        <div className="countdown animate-pulse">{hours}</div>
                        <div className="countdown-label">hours</div>
                    </div>
                    <div className="flex-1">
                        <div className="countdown animate-pulse">{minutes}</div>
                        <div className="countdown-label">minutes</div>
                    </div>
                    <div className="flex-1">
                        <div className="countdown animate-pulse">{seconds}</div>
                        <div className="countdown-label">seconds</div>
                    </div>
                </div>
                </div>
            )
        return (
            <div className="">
                <h3 className="text-green-300 text-sm mb-2 italic text-center">
                    Time remaining till the next winner pick
                </h3>
                <div className="flex space-x-6">
                    <div className="flex-1">
                        <div className="countdown">{hours}</div>
                        <div className="countdown-label">hours</div>
                    </div>
                    <div className="flex-1">
                        <div className="countdown">{minutes}</div>
                        <div className="countdown-label">minutes</div>
                    </div>
                    <div className="flex-1">
                        <div className="countdown">{seconds}</div>
                        <div className="countdown-label">seconds</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Countdown date={new Date(expiration * 1000)} renderer={renderer} />
        </div>
    )
}

export default CountdownTimer
