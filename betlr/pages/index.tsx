import { useAddress, useMetamask, useDisconnect, useContract, useContractData, useContractCall, ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image'
import Header from '../components/Header';

import ylogo from '../images/Y_logo.png';

import Login from "../components/Login";



const Home: NextPage = () => {

  const address = useAddress();  
 
  console.log(address);

  if(!address) {
    return <Login />
  }

  return ( 

    <div className="bg-[#1a1a0c] min-h-screen flex flex-col">
        <Head>
            <title>BETLER Lottery</title>
            <link rel="icon" href="favicon" />
        </Head>        

        <Header />        
    </div>    
  );
};

export default Home
