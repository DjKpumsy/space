import React, { useEffect, useState } from 'react';
import '../index.css';
import { task, highVoltage, notcoin, boost, ref, trophy, stat } from '../images';
import {Link} from "react-router-dom";
import {THEME, TonConnectUIProvider} from "@tonconnect/ui-react";
import {TonConnectButton} from "@tonconnect/ui-react";

const Vibrator = () => {
  
    const handleVibrate = () => {
        // Check if the Vibration API is supported
        if (navigator.vibrate) {
          // Vibrate for 200 milliseconds
          navigator.vibrate(200);
        } else {
          console.log('Vibration API not supported on this device.');
        }
      };


  return (
    
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">

      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">

        <div className="fixed top-0 left-0 w-full px-4 pt-8 z-10 flex flex-col items-center text-white">
        <TonConnectUIProvider
          manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
          uiPreferences={{ theme: THEME.DARK }}
          walletsListConfiguration={{
            includeWallets: [
              {
                appName: "tonwallet",
                name: "TON Wallet",
                imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
                aboutUrl: "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
                universalLink: "https://wallet.ton.org/ton-connect",
                jsBridgeKey: "tonwallet",
                bridgeUrl: "https://bridge.tonapi.io/bridge",
                platforms: ["chrome", "android"]
              },
              {
                appName: "nicegramWallet",
                name: "Nicegram Wallet",
                imageUrl: "https://static.nicegram.app/icon.png",
                aboutUrl: "https://nicegram.app",
                universalLink: "https://nicegram.app/tc",
                deepLink: "nicegram-tc://",
                jsBridgeKey: "nicegramWallet",
                bridgeUrl: "https://bridge.tonapi.io/bridge",
                platforms: ["ios", "android"]
              },
              {
                appName: "binanceTonWeb3Wallet",
                name: "Binance Web3 Wallet",
                imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjMEIwRTExIi8+CjxwYXRoIGQ9Ik01IDE1TDcuMjU4MDYgMTIuNzQxOUw5LjUxNjEzIDE1TDcuMjU4MDYgMTcuMjU4MUw1IDE1WiIgZmlsbD0iI0YwQjkwQiIvPgo8cGF0aCBkPSJNOC44NzA5NyAxMS4xMjlMMTUgNUwyMS4xMjkgMTEuMTI5TDE4Ljg3MSAxMy4zODcxTDE1IDkuNTE2MTNMMTEuMTI5IDEzLjM4NzFMOC44NzA5NyAxMS4xMjlaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0xMi43NDE5IDE1TDE1IDEyLjc0MTlMMTcuMjU4MSAxNUwxNSAxNy4yNTgxTDEyLjc0MTkgMTVaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0xMS4xMjkgMTYuNjEyOUw4Ljg3MDk3IDE4Ljg3MUwxNSAyNUwyMS4xMjkgMTguODcxTDE4Ljg3MSAxNi42MTI5TDE1IDIwLjQ4MzlMMTEuMTI5IDE2LjYxMjlaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0yMC40ODM5IDE1TDIyLjc0MTkgMTIuNzQxOUwyNSAxNUwyMi43NDE5IDE3LjI1ODFMMjAuNDgzOSAxNVoiIGZpbGw9IiNGMEI5MEIiLz4KPC9zdmc+Cg==",
                aboutUrl: "https://www.binance.com/en/web3wallet",
                deepLink: "bnc://app.binance.com/cedefi/ton-connect",
                bridgeUrl: "https://bridge.tonapi.io/bridge",
                platforms: ["chrome", "safari", "ios", "android"],
                universalLink: "https://app.binance.com/cedefi/ton-connect"
              }
            ]
          }}
          actionsConfiguration={{
              twaReturnUrl: 'https://t.me/DemoDappWithTonConnectBot/demo'
          }}
      >
        <TonConnectButton />
        </TonConnectUIProvider>
       
        
        <div className="fixed bottom-0 left-0 w-full px-4 pb-8 z-10">
        <button onClick={handleVibrate}>Tap to Vibrate</button>
        
          <div className="w-90 flex justify-between gap-1">
          
            <div className="flex-grow flex items-center max-w-100 text-sm ">
              <div className="ml-2 bg-[#8B4513] py-4 rounded-2xl flex justify-around">
              <Link to="/">
                <button className="flex flex-col items-center gap-3 mr-3 ml-5">
                  <img src={trophy} width={25} height={25} alt="High Voltage" />
                  <span>Earn</span>
                </button></Link>
                <div className="h-[48px] w-[2px] bg-[white]"></div>
              <Link to="/Task">
                <button className="flex flex-col items-center gap-3 mr-3 ml-5">
                  <img src={task} width={35} height={35} alt="High Voltage" />
                  <span>Task</span>
                </button></Link>
                <div className="h-[48px] w-[2px] bg-[white]"></div>
                <Link to="/Ref"><button className="flex flex-col items-center gap-3 mr-3 ml-5">
                  <img src={ref} width={35} height={35} alt="High Voltage" />
                  <span>Ref</span>
                </button></Link>
                <div className="h-[48px] w-[2px] bg-[white]"></div>
                <Link to="/Boost">
                  <button className="flex flex-col items-center gap-3 mr-3 ml-5">
                  <img src={boost} width={35} height={35} alt="High Voltage" />
                  <span>Boosts</span>
                </button></Link>
                <div className="h-[48px] w-[2px] bg-[white]"></div>
                <Link to="/Stat">
                  <button className="flex flex-col items-center gap-3 mr-5 ml-5">
                  <img src={stat} width={35} height={35} alt="High Voltage" />
                  <span>Stat</span>
                </button></Link>
              </div>
            </div>
          </div>

        </div>

      

      </div>
    </div>
    </div>
  );
};

export default Vibrator;
