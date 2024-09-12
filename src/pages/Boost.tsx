import React, { useEffect, useState } from 'react';
import '../index.css';
import Arrow from '../icons/Arrow';
import {notcoin, trophy} from '../images';
import {Link} from "react-router-dom";
import {List, ListItem, Alert, ListItemPrefix, Avatar, Card, Typography} from "@material-tailwind/react";
import axios from 'axios';

interface TelegramUser {
  id: number;
  username: string; 
}


interface User extends TelegramUser {
  points: number;
  telegramId: number;
}


const Boost = () => {
  const [user, setUser] = useState<User | null>(null);
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState({ text: '', type: '' }); // State for messages

    // Ensure that the Telegram Web App SDK is available
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
                      // setReferralLink(`https://t.me/Twint111bot?start=${telegramUser.id}`);
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

  const boost1 = async () => {
    if (user) {
        const originalPoints = points;

        if (points < 50) {
            setMessage({ text: 'Not enough points to activate booster.', type: 'danger' });
            return;
        }

        setPoints(prevPoints => prevPoints - 50);

        try {
            const res = await axios.post('https://back-w4s1.onrender.com/boost', {
                telegramId: user.telegramId
            });

            setPoints(res.data.points);
            setMessage({ text: 'Booster activated successfully!', type: 'success' });
        } catch (error: any) {
            console.error('Error boosting:', error);
            setPoints(originalPoints);

            if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
                setMessage({ text: 'Not enough points to activate booster.', type: 'danger' });
            } else {
                setMessage({ text: 'Failed to activate booster. Please try again.', type: 'danger' });
            }
        }
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
          <div className="w-full cursor-pointer">
            <div className="bg-[#1f1f1f] text-center py-2 rounded-xl">
              <p className="text-lg">Boosters</p>
            </div>
          </div>
          <div className="mt-12 text-5xl font-bold flex items-center">
            <img src={notcoin} width={44} height={44} />
            <span className="ml-2">{points.toLocaleString()}</span>
          </div>
          <div className="text-base mt-2 flex items-center">
            <img src={trophy} width={24} height={24} />
            <span className="ml-1">Gold <Arrow size={18} className="ml-0 mb-1 inline-block" /></span>
          </div>
        </div>


        <div className="fixed bottom-0 left-0 w-full px-4 pb-8 z-10">
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

      

        <div className="flex-grow flex items-center justify-center">
          {/* Display Alert Messages */}
          {message.text && (
                <Alert color="red"  onClose={() => setMessage({ text: '', type: '' })}>
                    {message.text}
                </Alert>
            )}

        <Card className="w-96" variant="filled" color="white" shadow={true}>
      <List>
      <ListItem onClick={boost1}>
          <ListItemPrefix>
            <Avatar variant="circular" alt="emma" src="https://img.icons8.com/color/48/hand-tool.png" />
          </ListItemPrefix>
          <div>
            <Typography variant="h6" color="blue-gray">
              Multitap
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              100000 Points
            </Typography>
          </div>
          
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <Avatar variant="circular" alt="icon" src="https://img.icons8.com/stickers/100/000000/charge-empty-battery.png" />
          </ListItemPrefix>
          <div>
            <Typography variant="h6" color="blue-gray">
              Energy Limit
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              100000 Points
            </Typography>
          </div>
          
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <Avatar variant="circular" alt="emma" src="https://img.icons8.com/stickers/100/performance-2.png" />
          </ListItemPrefix>
          <div>
            <Typography variant="h6" color="blue-gray">
              Energy Recharging Speed 
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              100000 Points
            </Typography>
          </div>
          
        </ListItem>
      </List>
    </Card>
        </div>

      </div>
    </div>
  );
};

export default Boost;
