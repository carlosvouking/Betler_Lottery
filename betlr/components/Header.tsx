// rfce -- react functional component 
import { useAddress, useDisconnect, ConnectWallet } from "@thirdweb-dev/react"
import React from "react"
import NavButton from "./NavButton"
import Image from 'next/image'
import { Bars3CenterLeftIcon, Bars4Icon, Bars3Icon } from "@heroicons/react/24/solid"

import {shortenAddress} from "../utils/shortenAddress";

import ylogo from '../images/logo_fryckio.png'


function Header() {

  const myaddress = useAddress();

  console.log(myaddress);

  return (

    <header className="grid grid-cols-2 md:grid-cols-5 justify-between items-center p-5">

        <div className="flex items-center space-x-3">
          <div className="cursor-pointer text-amber-300 text-xl font-bold">
              ADeLo              
              {/* <Image priority src={ylogo}  /> */}
          </div>
          <div>
              <h1 className="text-white font-semibold">Decentralized lottery</h1>
              <p className="text-amber-400 text-sm truncate">3wb User: {shortenAddress(myaddress)}</p>
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
