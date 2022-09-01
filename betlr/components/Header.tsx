// rfce -- react functional component 
import React from "react"
import NavButton from "./NavButton"
import Image from "../components/Image"
import { Bars3CenterLeftIcon, Bars4Icon, Bars3Icon } from "@heroicons/react/24/solid"

import ylogo from '../images/Y_logo.png'


function Header() {
  return (

    <header className="grid grid-cols-2 md:grid-cols-5 justify-between items-center p-5">

        <div className="flex items-center space-x-2">
          <div className="cursor-pointer text-amber-300 text-xl font-bold" >
              BetLr                
              {/* <Image src={ylogo} alt="logo" /> */}
          </div>
          <div>
              <h1 className="text-white text-lg font-semibold">Decentralized bet</h1>
              <p className="text-amber-900 text-sm truncate">Current User:</p>
          </div>  
        </div>

        <div className="hidden items-center justify-center md:col-span-3 md:flex ">        
             <div className="bg-[text-yellow-50]  p-4 space-x-2">
                 <NavButton isActive title="Enter Lottery" />
                 <NavButton title="Logout" />
             </div>                   
        </div>


        <div className="flex flex-col ml-auto text-right">
           <Bars3Icon className="w-8 h-8 mx-auto text-amber-400 cursor-pointer "/>
           <span className="md:hidden">
             <NavButton title="Logout" />
           </span>
        </div>
        
    </header>    
  )
}

export default Header
