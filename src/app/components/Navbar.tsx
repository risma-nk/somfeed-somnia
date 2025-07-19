'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import DisplayUsername from "./DisplayUsername";

export default function Navbar() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">

        {/* Kiri: Logo + Twitter */}
        <div className="flex items-center gap-3">
          <Link
            href="https://twitter.com/romanromannya"
            className="text-primary hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter Profile"
          >
            <FaXTwitter size={28} />
          </Link>
        </div>
        <div className="flex items-center">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus || authenticationStatus === "authenticated");

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {!connected ? (
                    <button
                      onClick={openConnectModal}
                      className="bg-orange-500 text-white font-semibold hover:bg-orange-600 px-4 py-2 rounded-full text-sm transition-all shadow-lg hover:shadow-orange-500/50"
                    >
                      Connect Wallet
                    </button>
                  ) : chain.unsupported ? (
                    <button
                      onClick={openChainModal}
                      className="bg-red-500 text-white font-semibold hover:bg-red-600 px-4 py-2 rounded-full text-sm flex items-center space-x-2 transition-all"
                    >
                      <span>Wrong Network</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 md:gap-3">
                      <button
                        onClick={openChainModal}
                        className="flex items-center text-white gap-2 bg-orange-500 hover:bg-orange-600 px-3 py-2 md:px-4 rounded-full transition-colors"
                      >
                        {chain.hasIcon && chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                            }}
                          />
                        )}
                        <span className="text-xs md:text-sm font-medium text-gray-200">
                          {chain.name}
                        </span>
                      </button>

                      <button
                        onClick={openAccountModal}
                        className="bg-orange-500 text-white hover:bg-orange-600 hover:text-white px-3 py-2 md:px-4 rounded-full text-xs md:text-sm font-medium transition-colors"
                      >
                        <DisplayUsername address={account.address as `0x${string}`} />
                      </button>
                    </div>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </nav>
    </header>
  );
}
