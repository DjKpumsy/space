import React, { useEffect, useState} from 'react';
import '../index.css';
import { task, boost, ref, trophy, stat } from '../images';
import {Link} from "react-router-dom";
import { Input, Button } from "@material-tailwind/react";
import axios from 'axios';


const Ref = () => {

  const [user, setUser] = useState(null);
  const [referralLink, setReferralLink] = useState('');
  const [points, setPoints] = useState(0);


  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();  // Request full-screen mode


        const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
        const telegramUser = initDataUnsafe?.user;
        const referrerId = initDataUnsafe?.start_param;

        if (telegramUser) {
            const fetchUser = async () => {
                try {
                    const res = await axios.post('https://back-w4s1.onrender.com/auth', {
                        telegramId: telegramUser.id,
                        username: telegramUser.username,
                        referrerId: referrerId || null
                    });

                    setUser(res.data);
                    setPoints(res.data.points);
                    setReferralLink(`https://t.me/Twint111bot?start=${telegramUser.id}`);
                } catch (error) {
                    
                    console.error('Error fetching user:', error);
                }
            };

            fetchUser();
        } else {
           
            console.error('Unable to fetch Telegram user information');
        }
    } else {
   
        console.error('Telegram Web App SDK not found');
    }
}, []);


  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">

      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">

        <div className="fixed top-20 left-0 w-full px-4 pt-8 z-10 flex flex-col items-center text-white">
          <div className="mt-12 text-3xl font-bold flex items-center">
            <span className="ml-2">0 Referrals</span>
          </div>
          <div className="relative flex w-full max-w-[24rem] top-20 bg-black-500" >
      <Input
        type="text"
        label="referral link"
        value={referralLink}
        color={"white"}
        className="pr-20"
        containerProps={{
          className: "min-w-0",
        }}
      />
      <Button
        size="sm"
        color={"green"}
        className="!absolute right-1 top-1 rounded"
      >
        Copy
      </Button>
    </div>
        </div>

       
        <div className="fixed bottom-0 left-0 w-full px-4 pb-8 z-10 mb-20">
      
          <div className="w-90 flex justify-between gap-1">
           
            <div className="flex-grow flex items-center max-w-100 text-sm ">
              <div className="ml-2 bg-[#8B4513] py-4 rounded-2xl flex justify-around">
              <Link to="/">
                <button className="flex flex-col items-center gap-3 mr-3 ml-5">
                  <img src="https://img.icons8.com/emoji/100/money-bag-emoji.png" width={35} height={35} alt="High Voltage" />
                  <span>Earn</span>
                </button></Link>
                <div className="h-[48px] w-[2px] bg-[white]"></div>
              <Link to="/Task">
                <button className="flex flex-col items-center gap-3 mr-3 ml-5">
                  <img src="https://img.icons8.com/fluency/100/what-i-do.png" width={35} height={35} alt="High Voltage" />
                  <span>Task</span>
                </button></Link>
                <div className="h-[48px] w-[2px] bg-[white]"></div>
                <Link to="/Ref"><button className="flex flex-col items-center gap-3 mr-3 ml-5">
                  <img src="https://img.icons8.com/3d-fluency/100/group--v4.png" width={35} height={35} alt="High Voltage" />
                  <span>Ref</span>
                </button></Link>
                <div className="h-[48px] w-[2px] bg-[white]"></div>
                <Link to="/Boost">
                  <button className="flex flex-col items-center gap-3 mr-3 ml-5">
                  <img src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/100/external-boost-dating-app-flaticons-lineal-color-flat-icons-3.png" width={35} height={35} alt="High Voltage" />
                  <span>Boosts</span>
                </button></Link>
                <div className="h-[48px] w-[2px] bg-[white]"></div>
                <Link to="/Stat">
                  <button className="flex flex-col items-center gap-3 mr-5 ml-5">
                  <img src="https://img.icons8.com/external-icongeek26-flat-icongeek26/100/external-launch-space-icongeek26-flat-icongeek26-1.png" width={35} height={35} alt="High Voltage" />
                  <span>L. Pad</span>
                </button></Link>
              </div>
            </div>
          </div>
 
        </div>



      </div>
    </div>
  );
};

export default Ref;
