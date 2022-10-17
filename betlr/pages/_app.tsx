import "../styles/globals.css"
import type { AppProps } from "next/app"
import { MoralisProvider } from "react-moralis"
//import { Toaster } from "react-hot-toast"

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <Component {...pageProps} />
            {/* <Toaster /> */}
        </MoralisProvider>
    )
}

export default MyApp
