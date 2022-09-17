// rfce -- react functional component

import React from "react"
import NavButton from "./NavButton"
import Image from "next/image"
import { Bars3CenterLeftIcon, Bars4Icon, Bars3Icon } from "@heroicons/react/24/solid"
import { shortenAddress } from "../utils/shortenAddress"
import { useMoralis } from "react-moralis"
import { useEffect } from "react"
import { ConnectButton } from "web3uikit"

import ylogo from "../images/Y_logo.png"

function Header() {
    const { enableWeb3, account, isWeb3Enabled } = useMoralis()

    return (
        <header className="grid grid-cols-2 md:grid-cols-5 justify-between items-center p-5">
            <div className="flex items-center space-x-3">
                <div className="cursor-pointer text-amber-300 font-bold">
                    <Image priority src={ylogo} className="rounded-xl" />
                </div>
                <div>
                    <h1 className="text-yellow-500 font-bold">DECENTRALIZED RAPHL</h1>
                    {/* <p className="text-white text-sm ">
                        Connected folks:
                        <b className="text-yellow-200">{shortenAddress(account)}</b>
                    </p> */}
                    <div className="w-15 mt-2">
                        <ConnectButton moralisAuth={false} />
                    </div>
                </div>
            </div>

            <div className="hidden items-center justify-center md:col-span-3 md:flex">
                <div className="bg-[text-yellow-50]  p-4 space-x-2">
                    <NavButton isActive title="Enter Raffle" />
                    <NavButton title="Logout" />
                </div>
            </div>

            <div className="flex flex-col ml-auto text-right">
                <Bars3Icon className="w-8 h-8 mx-auto text-amber-400 cursor-pointer" />
                <span className="md:hidden">
                    <NavButton title="Logout" />
                    {/* <ConnectWallet /> */}
                </span>
            </div>
        </header>
    )
}

export default Header
