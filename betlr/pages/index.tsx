import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import Header from "../components/Header"
import { useMoralis } from "react-moralis"

import ylogo from "../images/Y_logo.png"
import Login from "../components/Login"

const Home: NextPage = () => {
    const { account } = useMoralis()

    return (
        <div className="bg-[#1a1a0c] min-h-screen flex flex-col">
            <Head>
                <title>BETLER Lottery</title>
                {/* <link rel="icon" href="favicon" /> */}
            </Head>
            {account ? <Header /> : <Login />}
        </div>
    )
}

export default Home
