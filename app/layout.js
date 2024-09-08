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
  title: "Game Keli - Juara RM10,000 & 200 Rank",
  description: "Jom Sertai Pertandingan Memancing Keli di Kolam Pancing Paklong Mat Sen, Semanggol Perak.",
  openGraph: {
    images: [
      {
        url: 'https://paklongmatsen.com/images/kolam-pancing-paklong-mat-sen.png', // Use full URL
        width: 1200, // Recommended width
        height: 630, // Recommended height for Open Graph
        alt: 'Kolam Pancing Paklong Mat Sen',
      },
    ],
  },
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
