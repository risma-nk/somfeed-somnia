import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import dynamic from "next/dynamic";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "SomFeed",
  description: "post loud, post proud — it's all on the chain.",
  keywords:
    "Somnia, Somnia Network, Testnet, Faucet, ERC20, ERC721, Multi-sender, Blockchain Tools, dApp, Web3, Smart Contract Deployment, Test Tokens, Crypto",
  authors: [{ name: "L RMN", url: "https://lrmn.link" }],
  creator: "L RMN",
  publisher: "L RMN",
  alternates: {
    canonical: "https://SomFeed.vercel.app/",
  },
  icons: {
    icon: "/SomFeed.png",
    shortcut: "/SomFeed.png",
    apple: "/SomFeed.png",
  },
  openGraph: {
    title: "SOMNIA MEMORY GAME",
    description: "post loud, post proud — it's all on the chain.",
    url: "https://SomFeed.vercel.app/",
    siteName: "SOMRI",
    images: [
      {
        url: "https://SomFeed.vercel.app/SomFeed-og.png",
        width: 1200,
        height: 630,
        alt: "SomFeed - post loud, post proud — it's all on the chain.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@romanromannya",
    creator: "@romanromannya",
    title: "SomFeed: post loud, post proud — it's all on the chain.",
    description: "post loud, post proud — it's all on the chain.",
    images: ["https://SomFeed.vercel.app/SomFeed-og.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

const ClientOnlyProviders = dynamic(() => import("@/app/providers-client"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <ClientOnlyProviders>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </ClientOnlyProviders>
      </body>
    </html>
  );
}