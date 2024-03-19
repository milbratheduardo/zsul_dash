import React, { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';

const NavButton = ({ title, customFunc, icon, 
  color}) => (
    <TooltipComponent content={title} position='BottomCenter'>
      <button type='button' onClick={customFunc} 
      style={{ color }}
      className='relative text-xl rounded-full p-3 hover:bg-light-gray'>
         {icon}
      </button>
    </TooltipComponent>
  )



const Navbar = () => {
  const { activeMenu, setActiveMenu, isClicked, 
  setIsClicked, handleClick, screenSize, 
  setScreenSize, currentColor } = useStateContext();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.data.id || null;
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const imageData = {
      userId: userId,
      userType: "user",
      imageField: "picture"
    };

    const apiUrl = ' http://0.tcp.sa.ngrok.io:12599/image/blob';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(imageData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Resposta da API:', data);
      if (data.data !== '' && data.data !== null) {
        setImageSrc(data.data);
        console.log(`: ${data.data}`);
      }
    })
    .catch((error) => {
      console.error(`Fetch error: ${error}`);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if(screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  return (
    <div className='flex justify-between p-2 md:mx-6 relative'>
      <NavButton 
        title='Menu'
        customFunc={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)} 
        color={currentColor}
        icon={<AiOutlineMenu />} 
      />
      {screenSize > 900 && (
        <TooltipComponent content='Profile' position='BottomCenter'>
          <div className='flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg'>
            <img className='rounded-full w-12 h-12' src={imageSrc} alt='Profile'/>
            <p>
              <span className='text-gray-400 font-bold ml-1 text-14'>{user.data.teamName}</span>
            </p>
            <MdKeyboardArrowDown className='text-gray-400 text-14' />
          </div>
        </TooltipComponent>
      )}

      {isClicked.userProfile && screenSize > 900 && <UserProfile />}
    </div>
  )
}

export default Navbar;