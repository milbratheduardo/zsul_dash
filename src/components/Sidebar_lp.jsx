import React, { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from '../contexts/ContextProvider';
import logoZsul from '../img/logo_zsul.png';
import { PiSoccerBallFill } from 'react-icons/pi';
import { FaTrophy, FaPeopleGroup } from 'react-icons/fa6';
import { IoIosStats } from "react-icons/io";
import { ImCross } from "react-icons/im";

const Sidebar_lp = () => {
  const { activeMenu, setActiveMenu, screenSize, currentColor } = useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  const links = [
    {
      title: 'Menu',
      links: [
        { name: 'atletas_lp', icon: <FaPeopleGroup />, displayName: 'Atletas' },
        { name: 'campeonatos_lp', icon: <FaTrophy />, displayName: 'Campeonatos' },
        { name: 'estatisticas_lp', icon: <IoIosStats />, displayName: 'Estatísticas' },
        { name: 'punicoes_lp', icon: <ImCross />, displayName: 'Punições' }
      ]
    }
  ];

  return (
    <div className='ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10'>
      {activeMenu && (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%', 
            marginLeft: '-10px'
          }}>
            <Link to="http://localhost:5173/" onClick={handleCloseSideBar}>
              <img 
                src={logoZsul} 
                alt="Logo" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '180px', 
                  height: 'auto' 
                }} 
              />
            </Link>
            <TooltipComponent content="Menu" position='BottomCenter'>
              <button type='button' onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}              
              className='text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden'>
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className='mt-10'>
            {links.map((item) => (
              <div key={item.title}>
                <p className='text-gray-400 m-3 mt-4 uppercase'>
                  {item.title}
                </p>
                {item.links.map((link) => (
                  <NavLink
                    to={`/${link.name}`}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : ''
                    })}
                    className={({ isActive }) => isActive ? activeLink : normalLink}
                  >
                    {link.icon}
                    <span className='capitalize'>
                      {link.displayName}
                    </span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar_lp;
