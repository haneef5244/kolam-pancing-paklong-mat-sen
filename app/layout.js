import Head from "next/head";
import { ServerHeader } from "./frontend/components/header/server";
import { Providers } from "./providers";
import { Lato, Inter } from "next/font/google";
import './globals.css'

const lato = Lato({
  weight: '400',
  subsets: ['latin'],
  display: 'swap'
})

const inter = Inter({
  subsets: ['latin']
})

export const metadata = {
  title: "Mat Sen Kolam Pancing",
  description: "Kolam Pancing Mat Sen",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel='icon' href='/logo512.png' sizes="any" />
      </Head>
      <body className={lato.className} style={{ margin: 0 }}>
        <Providers font={lato}>
          <ServerHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
