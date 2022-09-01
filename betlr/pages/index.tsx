import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'

import ylogo from '../images/Y_logo.png'

const Home: NextPage = () => {
  return (
    <div className="bg-[#292911] min-h-screen flex flex-col ">
        <Head>
            <title>BETLER Lottery</title>
        </Head>

        <Header />
    </div>    
  )
}

export default Home
