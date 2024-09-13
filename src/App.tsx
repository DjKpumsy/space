import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Task from './pages/Task';
import Boost from './pages/Boost';
import Ref from './pages/Ref';
import Stat from './pages/Stat';
import React, { useEffect, useState } from 'react';
import './index.css';
import { Button } from "@material-tailwind/react";
import {highVoltage, notcoin, notcoin3, notcoin4, notcoin5, notcoin6, notcoin7} from './images';
import axios from 'axios';

interface TelegramUser {
  id: number;
  username: string;
  chan: number;
  group: number;
  coinsToAdd: number;
  henergy: number;
}

interface User extends TelegramUser {
  points: number;
  telegramId: number;
}

const images = [notcoin3, notcoin4, notcoin, notcoin5, notcoin6, notcoin7]; // List of images to cycle through

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Task" element={<Task />} />
        <Route path="/Boost" element={<Boost />} />
        <Route path="/Ref" element={<Ref />} />
        <Route path="/Stat" element={<Stat/>} />
      </Routes>
    </BrowserRouter>
  );
};

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [points, setPoints] = useState(0);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const [pointsToAdd, setPointsToAdd] = useState(0);
  const [isFarming, setIsFarming] = useState(false); // Farming set
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 7 hours in seconds
  const [energyToReduce, setEnergyToReduce] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [clickCount, setClickCount] = useState(0); // Track number of clicks
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current image index
  const [farmingPoints, setFarmingPoints] = useState(0); // State for the real-time farming points

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (energy - energyToReduce < 0) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addPoints();
    setPoints(points + pointsToAdd);
    setEnergy(energy - energyToReduce < 0 ? 0 : energy - energyToReduce);
    setClicks([...clicks, { id: Date.now(), x, y }]);
    setClickCount(prevCount => prevCount + 1);

    if (clickCount + 1 === 5) {
      setCurrentImageIndex((currentImageIndex + 1) % images.length);
      setClickCount(0);
    }
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();  // Request full-screen mode

      const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
      const telegramUser = initDataUnsafe?.user;
      const referrerId = initDataUnsafe?.start_param;

      if (telegramUser) {
        setPointsToAdd(telegramUser.coinsToAdd || 0); // Set pointsToAdd from telegramUser
        const fetchUser = async () => {
          try {
            const res = await axios.post('https://back-w4s1.onrender.com/auth', {
              telegramId: telegramUser.id,
              username: telegramUser.username,
              chan: telegramUser.chan,
              group: telegramUser.group,
              referrerId: referrerId || null,
              coinsToAdd: telegramUser.coinsToAdd,
              henergy: telegramUser.henergy,
            });

            setUser(res.data);
            setPoints(res.data.points);
            setEnergyToReduce(res.data.coinsToAdd);

            // Fetch henergy from new API endpoint
            const henergyRes = await axios.post('https://back-w4s1.onrender.com/getHenergy', {
              telegramId: telegramUser.id
            });
            setEnergy(henergyRes.data.henergy);  // Set energy from the fetched data
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

  const addPoints = async () => {
    if (user) {
      try {
        const res = await axios.post('https://back-w4s1.onrender.com/addPoints', {
          telegramId: user.telegramId
        });
        setPoints(res.data.points);
      } catch (error) {
        console.error('Error adding points:', error);
      }
    } else {
      console.error('User is null, cannot add points');
    }
  };

// Function to start farming
const startFarming = async () => {
  if (user) {
    try {
      const response = await axios.post('https://back-w4s1.onrender.com/startFarming', { 
        telegramId: user.telegramId 
      });

      if (response.data && response.data.farmingStartTime) {
        setIsFarming(true);
        setTimeLeft(5 * 60); // Set timer to 5 minutes for testing
        setFarmingPoints(0); // Reset farming points on start

        // Store farming start time in local storage to persist across page refreshes
        localStorage.setItem('farmingStartTime', response.data.farmingStartTime);
      }
    } catch (error) {
      console.error('Error starting farming:', error);
    }
  }
};

// Function to calculate remaining time based on farming start time
const calculateRemainingTime = (startTime: string) => {
  const now = new Date();
  const farmingStartTime = new Date(startTime);
  const elapsedSeconds = Math.floor((now.getTime() - farmingStartTime.getTime()) / 1000);
  const totalFarmingSeconds = 5 * 60; // 7 hours in seconds

  return totalFarmingSeconds - elapsedSeconds;
};

// useEffect to handle farming timer and persist across refreshes
useEffect(() => {
  let timer: NodeJS.Timeout | null = null;
  const telegramId = user?.telegramId;

  // Function to fetch farming status from the server
  const fetchFarmingStatus = async () => {
    if (telegramId) {
      try {
        const response = await axios.post('https://back-w4s1.onrender.com/getFarmingStatus', { telegramId });
        const { farmingStartTime, isFarming: serverIsFarming } = response.data;

        if (serverIsFarming && farmingStartTime) {
          const remainingTime = calculateRemainingTime(farmingStartTime);

          // If there is still time left, continue farming
          if (remainingTime > 0) {
            setTimeLeft(remainingTime);
            setIsFarming(true);
          } else {
            // Farming is finished
            setIsFarming(false);
            await updateFarmingPoints(); // Call the function to update points when time runs out
          }
        } else {
          setIsFarming(false); // No farming session active
        }
      } catch (error) {
        console.error('Error fetching farming status:', error);
      }
    }
  };

  // Fetch farming status on component mount
  fetchFarmingStatus();

  if (isFarming && timeLeft > 0) {
    timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
      setFarmingPoints(prev => prev + 0.1); // Increment farming points every second
    }, 1000);
  }

  // Stop farming and update points when time is up
  if (timeLeft <= 0 && isFarming) {
    setIsFarming(false); // Clear farming session when time ends
    if (timer) {
      clearInterval(timer);
    }
    // Call the function to update points
    updateFarmingPoints();
  }

  return () => {
    if (timer) {
      clearInterval(timer); // Ensure timer is cleared on component unmount
    }
  };
}, [isFarming, timeLeft, user?.telegramId]);

// Function to update farming points once 5 minutes have passed
const updateFarmingPoints = async () => {
  const telegramId = user?.telegramId;
  if (telegramId) {
    try {
      const updateResponse = await axios.post('https://back-w4s1.onrender.com/updateFarmingPoints', { telegramId });
      setPoints(updateResponse.data.points); // Update points after farming is complete
    } catch (error) {
      console.error('Error updating farming points:', error);
    }
  }
};



  // useEffect hook to restore energy over time
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 1, user?.henergy ?? 1000));
    }, 100); // Restore 10 energy points every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

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
              <p className="text-lg">Hi, {user ? user.username : '....'}{user ? user.chan : '0'}{user ? user.group : '0'}</p>
            </div>
          </div>
          <div className="mt-12 text-5xl font-bold flex items-center">
            <img src={images[currentImageIndex]} width={44} height={44} alt="notcoin" />
            <span className="ml-2">{points.toLocaleString()}</span>
          </div>
          {/* <div className="text-base mt-2 flex items-center">
            <img src={trophy} width={24} height={24} alt="trophy" />
            <span className="ml-1">Gold <Arrow size={18} className="ml-0 mb-1 inline-block" /></span>
          </div> */}
        </div>

        <div className="fixed bottom-0 left-0 w-full px-4 pb-8 z-10">
          <div className="w-1/3 flex items-center justify-start max-w-32">
            <div className="flex items-center justify-center">
              <img src={highVoltage} width={34} height={34} alt="High Voltage" />
              <div className="ml-2 text-left">
                <span className="text-white text-1xl font-bold block">{energy}</span>
                <span className="text-white text-large opacity-80">/ {user?.henergy ?? 0}</span>
              </div>
            </div>
          </div>
         
          <div className="w-full bg-[#4e0246cc] rounded-full mb-5 ">
            <div className="bg-gradient-to-r from-[#8B4513] to-[#DAA520] h-4 rounded-full" style={{ width: `${(energy / (user?.henergy ?? 0)) * 100}%` }}></div>
          </div>
          <div className="flex items-center ml-20">
          <Button variant="filled" className="flex items-center gap-4" onClick={startFarming} disabled={isFarming}>
          {isFarming ? `Farming in progress... ${farmingPoints.toFixed(1)} points` : 'Start Farming'}
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="35" height="35" viewBox="0 0 58 58">
      <path fill="#424242" d="M45,9h-1V7h-2V5h-2V3h-2V1h-2v2h-2V1h-4v2h-2V1h-2v2h-2h-2v2h-1h-1v2h-6v2h-4v2H8V9H6v2H4v2h2v2H4v4 H2v6h2v2h2v-2h2v-4h2v-2h2v2h2v2h2v2h2v2h2v6h2v2h2v8h-2v2v1v1h16h2v-8h-2v-2h2v-6v-1v-1h2v-6h-2v-2h2v-2h2v-2h2v-2h-2v-2h2v-2V9H45 z M20,23v-2h-2v-2h-2v-2h-2v-2h2v-2h2v2h2v2h2v-2h2v4h-2v2h2v2h2v2h-4v-2H20z"></path><path fill="#6d4c41" d="M26 5L22 5 22 11 20 11 20 15 22 15 22 13 26 13 26 11 28 11 28 13 32 13 32 15 34 15 34 13 36 13 36 15 38 15 38 17 40 17 40 15 42 15 42 11 40 11 40 9 42 9 42 7 38 7 38 5 36 5 36 7 34 7 34 5 32 5 32 3 30 3 30 5z"></path><path fill="#827717" d="M6 11H8V13H6z"></path><path fill="#757575" d="M6 19H8V21H6zM4 21H6V25H4zM8 17H10V19H8zM10 15H12V17H10zM12 13H14V15H12zM14 11H16V13H14zM18 9H20V11H18z"></path><path fill="#827717" d="M12 17H14V19H12zM14 19H16V21H14zM16 21H18V23H16zM18 23H20V25H18zM20 25H22V27H20z"></path><path fill="#ffab91" d="M34 15L36 15 36 21 34 21 34 23 26 23 26 21 24 21 24 19 26 19 26 13 28 13 28 19 30 19 30 15 32 15 32 17 34 17z"></path><path fill="#4e342e" d="M32 3H34V5H32zM36 3H38V5H36zM34 5H36V7H34zM24 7H28V9H24zM38 5H40V7H38zM40 15L40 17 38 17 38 19 42 19 42 17 44 17 44 15zM30 11L30 9 28 9 28 13 32 13 32 11zM24 11H26V13H24zM36 13H38V15H36zM38 11H40V13H38zM34 9H38V11H34zM40 9L40 11 42 11 42 13 44 13 44 11 44 9z"></path><path fill="#fafafa" d="M30 15H32V19H30z"></path><path fill="#ff8a65" d="M34 19H36V21H34zM32 21H34V23H32z"></path><path fill="#bdbdbd" d="M4 19H6V21H4zM6 15H8V19H6zM8 13H10V17H8zM10 11H12V15H10zM12 11H14V13H12zM14 9H18V11H14z"></path><path fill="#ffab91" d="M22 27H26V32H22z"></path><path fill="#ff8a65" d="M25 27L25 31 22 31 22 33 27 33 27 31 27 27z"></path><path fill="#9ccc65" d="M34 23L34 25 27 25 27 31 34 31 34 29 40 29 40 23z"></path><path fill="#689f38" d="M36 21H38V23H36zM36 31H38V35H36zM34 27H36V29H34z"></path><path fill="#9ccc65" d="M32 33H36V35H32z"></path><path fill="#689f38" d="M30 29H34V31H30zM38 27H40V29H38z"></path><path fill="#33691e" d="M24 43H26V45H24zM26 41H28V43H26zM32 43L32 41 30 41 30 43 28 43 28 45 34 45 34 43z"></path><path fill="#ffa726" d="M26 35H28V41H26zM34 41L34 35 30 35 30 41 32 41 32 43 36 43 36 41z"></path><path fill="#6d4c41" d="M38 37L38 35 34 35 34 41 36 41 36 43 34 43 34 45 36 45 38 45 38 39 36 39 36 37z"></path>
      </svg>
      </Button>
          </div><br></br>
          <p>Time Left: {new Date(timeLeft * 1000).toISOString().substr(11, 8)}</p>
          <div className="w-90 flex justify-between gap-1">
            <div className="flex-grow flex items-center max-w-100 text-sm ">
              <div className="ml-2 bg-[#8B4513] py-4 rounded-2xl flex justify-around">
                <Link to="/">
                  <button className="flex flex-col items-center gap-3 mr-3 ml-5">
                    <img src="https://img.icons8.com/emoji/100/money-bag-emoji.png" width={35} height={35} alt="trophy" />
                    <span>Earn</span>
                  </button>
                </Link>
                <div className="h-[48px] w-[2px] bg-[white]"></div>
                <Link to="/Task">
                  <button className="flex flex-col items-center gap-3 mr-3 ml-5">
                    <img src="https://img.icons8.com/fluency/100/what-i-do.png" width={35} height={35} alt="task" />
                    <span>Task</span>
                  </button>
                </Link>
                <div className="h-[48px] w-[2px] bg-[white]"></div>
                <Link to="/Ref">
                  <button className="flex flex-col items-center gap-3 mr-3 ml-5">
                    <img src="https://img.icons8.com/3d-fluency/100/group--v4.png" width={35} height={35} alt="ref" />
                    <span>Ref</span>
                  </button>
                </Link>
                <div className="h-[48px] w-[2px] bg-[white]"></div>
                <Link to="/Boost">
                  <button className="flex flex-col items-center gap-3 mr-3 ml-5">
                    <img src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/100/external-boost-dating-app-flaticons-lineal-color-flat-icons-3.png" width={35} height={35} alt="boost" />
                    <span>Boosts</span>
                  </button>
                </Link>
                <div className="h-[48px] w-[2px] bg-[white]"></div>
                <Link to="/Stat">
                  <button className="flex flex-col items-center gap-3 mr-5 ml-5">
                    <img src="https://img.icons8.com/external-icongeek26-flat-icongeek26/100/external-launch-space-icongeek26-flat-icongeek26-1.png" width={35} height={35} alt="stat" />
                    <span>L. Pad</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

       
          <div className="flex-grow flex items-center justify-center">
          <div className="relative" onClick={handleClick}>
            <img src={images[currentImageIndex]} width={300} height={300} alt="notcoin" />
            {clicks.map((click) => (
              <div
                key={click.id}
                className="absolute text-6xl font-bold opacity-0"
                style={{
                  top: `${click.y - 42}px`,
                  left: `${click.x - 28}px`,
                  animation: `float 1s ease-out`
                }}
                onAnimationEnd={() => handleAnimationEnd(click.id)}
              >
                +{user ? user.coinsToAdd : ''}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
