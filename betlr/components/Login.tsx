import React from "react"
import Image from "next/image"
import { useMoralis } from "react-moralis"

import ylogo from "../images/animated.svg"

function Login() {
    const { enableWeb3, account, isWeb3Enabled } = useMoralis()

    const connect = async () => {
        await enableWeb3();
    }

    return (
        <div className="flex flex-col min-h-screen justify-center items-center text-center">
            <div className="items-center mb-10">
                <Image className="rounded" width={250} height={150} priority src={ylogo} />
                <h1 className="text-yellow-500 text-3xl font-bold">DECENTRALIZED RAPHL</h1>
                <h2 className="text-white mb-5">
                    Participate by logging with a wallet account
                </h2>
                <button
                    className="rounded-lg bg-white font-bold shadow-lg py-5 px-8"
                    onClick={connect}
                >
                    Connect Wallet
                </button>
            </div>
        </div>
    )
}

export default Login
