// rfce -- react functional component

import React from "react"
import NavButton from "./NavButton"
import Image from "next/image"
import {
    Bars3CenterLeftIcon,
    Bars4Icon,
    Bars3Icon,
    Bars3BottomLeftIcon,
} from "@heroicons/react/24/solid"
import { shortenAddress } from "../utils/shortenAddress"
import { useMoralis } from "react-moralis"
import { useEffect } from "react"
import { ConnectButton, Web3Api } from "web3uikit"
import Marquee from "react-fast-marquee"

import ylogo from "../images/Y_logo.png"

function Header() {
    const { enableWeb3, account, isWeb3Enabled, deactivateWeb3, user } = useMoralis()

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
                    <NavButton isActive title="Enter Raffle" />
                    <NavButton title="Disconnect Wallet" />
                    {/* <button onClick={deactivateWeb3}>Disconnect</button> */}
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
