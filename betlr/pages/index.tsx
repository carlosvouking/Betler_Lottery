import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import { useMoralis } from "react-moralis"
import { useEffect } from "react"
import { PropagateLoader } from "react-spinners"

import Header from "../components/Header"
import ylogo from "../images/Y_logo.png"
import Login from "../components/Login"

const Home: NextPage = () => {
    const { enableWeb3, account, isWeb3Enabled, isWeb3EnableLoading } = useMoralis()

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
            {account ? <Header /> : <Login />}

            <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5">
                <div className="raffleStats-Wrapper">
                    <h1 className="text-4xl text-yellow-200 font-semibold text-center">
                        Next Pick
                    </h1>
                    <div className="flex justify-between p-2 space-x-2">
                        <div className="raffleStats">
                            <h2 className="text-sm">Total pool</h2>
                            <p className="text-xl">0.1 ETH</p>
                        </div>
                        <div className="raffleStats">
                            <h2 className="text-sm">Remaining participations</h2>
                            <p className="text-xl">50</p>
                        </div>
                    </div>
                    {/* clock ticking */}
                </div>

                <div className="raffleStats-wrapper space-y-2">

                </div>
            </div>




            <div>
                <div>Fee per participation</div>
            </div>
        </div>
    )
}

export default Home
