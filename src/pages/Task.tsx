import { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import { List, ListItem, ListItemPrefix, ListItemSuffix, Chip, Avatar, Card, Typography } from "@material-tailwind/react";
import axios from 'axios';

interface Task {
  id: number;
  name: string;
  points: number;
  completed: boolean;
  url: string;
  avatar: string;
  color: string;
}

type User = {
  telegramId: string;
  username: string;
  points: number;
  chan: number;
  group: number;
  coinsToAdd: number;
  henergy: number;
};

const Task = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'Join KangaBuck Channel', points: 250000, completed: false, url: 'https://t.me/jointaptwitch', avatar: 'https://img.icons8.com/nolan/64/telegram-app.png', color: 'green' },
    { id: 2, name: 'Join KangaBuck Chat', points: 250000, completed: false, url: 'https://t.me/taptwitch', avatar: 'https://img.icons8.com/nolan/64/telegram-app.png', color: 'green' },
    { id: 3, name: 'Follow KangaBuck on Twitter', points: 200000, completed: false, url: 'https://x.com/TAPTWITCH?t=-xAFQPjjLLeFTfTLkkLKCQ&s=09', avatar: 'https://img.icons8.com/ios-filled/50/twitterx--v1.png', color: 'black' },
    { id: 4, name: 'Join Partner Channel', points: 150000, completed: false, url: 'https://t.me/Quintexai_official_announcement', avatar: 'https://img.icons8.com/nolan/64/telegram-app.png', color: 'black' },
    { id: 5, name: 'Add 🦘 in Telegram Name', points: 250000, completed: false, url: 'https://x.com/QTXAIofficial?t=MlloRWMfFQz7UJJOrM0eBg&s=09', avatar: 'https://img.icons8.com/plasticine/100/kangaroo.png', color: 'black' },
    { id: 6, name: 'Subscribe to YouTube', points: 100000, completed: false, url: 'https://www.youtube.com/@TapTwitch', avatar: 'https://img.icons8.com/fluency/48/youtube-squared.png', color: 'black' },
    { id: 7, name: 'Make a TON Transaction', points: 1000000, completed: false, url: 'https://www.youtube.com/@TapTwitch', avatar: 'https://img.icons8.com/color/96/transaction.png', color: 'black' }
  ]);

  const [allTasksCompleted, setAllTasksCompleted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [countdown, setCountdown] = useState(13); // Initial countdown for alert value



  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user === null) {
        console.error('User is null');
        return;
      }

      try {
        const res = await axios.post('https://back-w4s1.onrender.com/getUser', {
          telegramId: user.telegramId
        });
        const completedTasks = res.data.completedTasks || [];
        const updatedTasks = tasks.filter(task => !completedTasks.includes(task.id));
        setTasks(updatedTasks);

        if (updatedTasks.length === 0) {
          setAllTasksCompleted(true);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [user, tasks]);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand(); // Request full-screen mode

      const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
      const telegramUser = initDataUnsafe?.user;
      const referrerId = initDataUnsafe?.start_param;

      if (telegramUser) {
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

  const handleTaskCompletion = async (taskId: number, points: number) => {
    if (user === null) {
      alert('User information is missing. Please try again later.');
      return;
    }

    // Set a 6-second delay before checking membership status
    setTimeout(async () => {
      try {
        // Check if the user is a member of the required group and channel
        const res = await axios.post('https://25be-197-210-55-86.ngrok-free.app/checkMembership', {
          telegramId: user.telegramId,
        });

        if (res.data.isMember) {
        
          // Update points in the backend
          await axios.post('https://back-w4s1.onrender.com/completeTask', {
            telegramId: user.telegramId,
            taskId: taskId,
            points: points,
          });

          // Remove completed task from the task list
          const updatedTasks = tasks.filter((task) => task.id !== taskId);
          setTasks(updatedTasks);

          // Notify the user that points were added
          alert('Points added successfully!');

          if (updatedTasks.length === 0) {
            setAllTasksCompleted(true);
          }
        } else {
          alert('Please complete the task by joining both the channel and group before claiming your points.');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert('Error completing task1: ' + error.message);
        } else if (error instanceof Error) {
          alert('Error completing Me:' + error.message);
        } else {
          alert('An unknown error occurred while completing the task.');
        }
      }
    }, 10000); // 6 seconds delay
  };

  const handleTaskCompletion2 = async (taskId: number, points: number) => {
    if (user === null) {
      alert('User information is missing. Please try again later.');
      return;
    }

    // Set a 6-second delay before checking membership status
    setTimeout(async () => {
      try {
        // Check if the user is a member of the required group and channel
        const res = await axios.post('https://25be-197-210-55-86.ngrok-free.app/partner', {
          telegramId: user.telegramId,
        });

        if (res.data.isPartnerMember) {
        
          // Update points in the backend
          await axios.post('https://back-w4s1.onrender.com/completeTask', {
            telegramId: user.telegramId,
            taskId: taskId,
            points: points,
          });

          // Remove completed task from the task list
          const updatedTasks = tasks.filter((task) => task.id !== taskId);
          setTasks(updatedTasks);

          // Notify the user that points were added
          alert('Points added successfully!');

          if (updatedTasks.length === 0) {
            setAllTasksCompleted(true);
          }
        } else {
          alert('Please complete the task by joining partner channel.');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert('Error completing task1: ' + error.message);
        } else if (error instanceof Error) {
          alert('Error completing Me:' + error.message);
        } else {
          alert('An unknown error occurred while completing the task.');
        }
      }
    }, 10000); // 6 seconds delay
  };

  const handleTaskCompletion3 = async (taskId: number, points: number) => {
    if (user === null) {
      alert('User information is missing. Please try again later.');
      return;
    }
  
    // Set a 6-second delay before completing the task
    setTimeout(async () => {
      try {
        // Update points in the backend
        await axios.post('https://back-w4s1.onrender.com/completeTask', {
          telegramId: user.telegramId,
          taskId: taskId,
          points: points,
        });
  
        // Remove completed task from the task list
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
  
        // Notify the user that points were added
        alert('Points added successfully!');
  
        if (updatedTasks.length === 0) {
          setAllTasksCompleted(true);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert('Error completing task: ' + error.message);
        } else if (error instanceof Error) {
          alert('Error completing task: ' + error.message);
        } else {
          alert('An unknown error occurred while completing the task.');
        }
      }
    }, 18000); // 6 seconds delay
  };

  const handleTaskCompletion4 = async (taskId: number, points: number) => {
    if (user === null) {
      alert('User information is missing. Please try again later.');
      return;
    }

    // Set a 6-second delay before checking membership status
    setTimeout(async () => {
      try {
        // Check if the user is a member of the required group and channel
        const res = await axios.post('https://25be-197-210-55-86.ngrok-free.app/checkEmoji', {
          telegramId: user.telegramId,
        });

        if (res.data.hasEmoji) {
        
          // Update points in the backend
          await axios.post('https://back-w4s1.onrender.com/completeTask', {
            telegramId: user.telegramId,
            taskId: taskId,
            points: points,
          });

          // Remove completed task from the task list
          const updatedTasks = tasks.filter((task) => task.id !== taskId);
          setTasks(updatedTasks);

          // Notify the user that points were added
          alert('Points added successfully!');

          if (updatedTasks.length === 0) {
            setAllTasksCompleted(true);
          }
        } else {
          alert('Please complete the task by adding 🦘 to your TG name.');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert('Error completing task1: ' + error.message);
        } else if (error instanceof Error) {
          alert('Error completing Me:' + error.message);
        } else {
          alert('An unknown error occurred while completing the task.');
        }
      }
    }, 10000); // 6 seconds delay
  };
  

  const handleTaskClick = (taskId: number, url: string) => {
    localStorage.setItem('pendingTaskId', taskId.toString());

    // Show alert
    setShowAlert(true);
    setCountdown(13); // Reset countdown to 10

  // Start the countdown
  const countdownInterval = setInterval(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        clearInterval(countdownInterval);
        setShowAlert(false); // Hide alert after countdown ends
        return 0;
      }
      return prev - 1;
    });
  }, 1000); // Update countdown every second

    window.location.href = url;
  };



useEffect(() => {
  const pendingTaskId = localStorage.getItem('pendingTaskId');

  if (pendingTaskId) {
    const taskId = parseInt(pendingTaskId, 10);

    // Call different functions based on the task ID
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      if (taskId === 1 || taskId === 2) {
        handleTaskCompletion(task.id, task.points); // For tasks 1 and 2
      } else if (taskId === 4) {
        handleTaskCompletion2(task.id, task.points); // For task 3
      } else if (taskId === 3) {
        handleTaskCompletion3(task.id, task.points); // For task 4
      } else if (taskId === 6) {
        handleTaskCompletion3(task.id, task.points); // For task 5
      } else if (taskId === 5) {
        handleTaskCompletion4(task.id, task.points); // For task 5
      }
      // Add more conditions here for other task IDs and corresponding functions
    }

    // Clear the pending task ID from local storage
    localStorage.removeItem('pendingTaskId');
  }
}, [tasks]);


  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">
      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">
        <div className="fixed top-14 left-0 w-full px-4 pt-14 z-10 flex flex-col items-center text-white">
        {showAlert && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="alert alert-info">
              Checking...{countdown}s
            </div>
            </div>
          )}
          <div className="w-full cursor-pointer">
            <div className="bg-[#1f1f1f] text-center py-2 rounded-xl ">
              <p className="text-lg">Complete task to earn Points. </p>
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


          <Card className="w-95 ">
            <List>
              {allTasksCompleted ? (
                <Typography variant="h6" color="green">
                  You Completed All Tasks!
                </Typography>
              ) : (
                tasks.map(task => (
                  <ListItem 
                    key={task.id} 
                    onClick={() => handleTaskClick(task.id, task.url)} 
                    disabled={task.completed}
                    style={{ cursor: task.completed ? 'not-allowed' : 'pointer', opacity: task.completed ? 0.5 : 1 }}
                  >
                    <ListItemPrefix>
                      <Avatar variant="circular" alt={task.name} src={task.avatar} />
                    </ListItemPrefix>
                    <div>
                      <Typography variant="h6" color="blue-gray">
                        {task.name}
                      </Typography>
                      <Typography variant="small" color="gray" className="font-normal">
                        {task.points} Points
                      </Typography>
                    </div>
                    <ListItemSuffix>
                      <Chip
                        value="Claim"
                        size="sm"
                        color={task.color}
                        className="rounded-full px-2 py-1 text-xs group-hover:bg-white/20 group-hover:text-white"
                      />
                    </ListItemSuffix>
                  </ListItem>
                ))
              )}
            </List>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Task;