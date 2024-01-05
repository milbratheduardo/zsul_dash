import React, { useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import avatar from '../data/avatar.jpg';
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

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener(
      'resize', handleResize);
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
        customFunc={() => setActiveMenu(
        (prevActiveMenu) => !prevActiveMenu)} 
        color={currentColor}
        icon={<AiOutlineMenu />} 
        />
        <TooltipComponent 
        content='Profile' position='BottomCenter'>
          <div className='flex items-center gap-2 cursor-pointer
          p-1 hover:bg-light-gray rounded-lg' 
          onClick={() => handleClick('userProfile')}>
            <img 
              className='rounded-full w-8 h-8'
              src={avatar}
            />
            <p>
              <span className='text-gray-400 font-bold ml-1 text-14'>
                {user.data.teamName}
              </span>
            </p>
            <MdKeyboardArrowDown className='text-gray-400 text-14' />
          </div>
        </TooltipComponent>

        {isClicked.userProfile && <UserProfile />}
    </div>
  )
}

export default Navbar