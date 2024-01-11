import React, { useEffect, useState} from 'react';
import { Button } from '../components';
import { earningData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings } from '../components';

const Home = () => {  
    const { activeMenu, themeSettings, setThemeSettings, 
    currentColor, currentMode } = useStateContext();
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const [userAtletas, setUserAtletas] = useState([]);


    useEffect(() => {
      const fetchUserAtletas = async () => {
        const userId = user.data.id;
        try {
          const responseAtletas = await fetch(`http://localhost:3000/elenco/team/${userId}`);
  
          if (responseAtletas.ok) {
            const dataAtletas = await responseAtletas.json();
            setUserAtletas(dataAtletas);
          } else {
            console.error('Erro ao buscar atletas do usuário');
          }
        } catch (error) {
          console.error('Erro na solicitação:', error);
        }
      };
  
      if (user.data.id) {
        fetchUserAtletas();
      }
    }, [user.data.id]);


  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <div className='flex relative dark:bg-main-dark-bg'>
        <div className='fixed right-4 bottom-4' style={{ zIndex: '1000' }}>
          <TooltipComponent content="Opções" position='Top'>
            <button
              type='button'
              className='text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white'
              onClick={() => setThemeSettings(true)}
              style={{ background: currentColor, borderRadius: '50%' }}
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>
        {activeMenu ? (
          <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white'>
            <Sidebar />
          </div>
        ) : (
          <div className='w-0 dark:bg-secondary-dark-bg'>
            <Sidebar />
          </div>
        )}
        <div
          className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
            activeMenu ? 'md:ml-72' : 'flex-2'
          }`}
        >
          <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
            <Navbar />
          </div>

          {themeSettings && <ThemeSettings />}

          <div className='mt-12'>
            <div className='flex flex-wrap lg:flex-nowrap justify-center'>
              <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='font-bold text-gray-400'>Número de Atletas</p>
                    <p className='text-2xl'>{userAtletas.data?.length ? userAtletas.data?.length : 'Carregando...'}</p>
                  </div>
                </div>
                <div className='mt-6'>
                  <Button color='white' bgColor={currentColor} text='Download' borderRadius='10px' size='md' />
                </div>
              </div>

              <div className='flex m-3 flex-wrap justify-center gap-1 items-center'>
                {earningData.map((item) => (
                  <div key={item.title} className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl'>
                    <button
                      type='button'
                      style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                      className='text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl'
                    >
                      {item.icon}
                    </button>
                    <p className='mt-3'>
                      <span className='text-lg font-semibold'>{item.amount}</span>
                    </p>
                    <p className='text-sm text-gray-400 mt-1'>{item.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex gap-10 flex-wrap justify-center'>
              <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-4 m-3 rounded-2xl md:w-780'>
                <div className='flex justify-between'>
                  <p className='font-semibold text-xl'>Próximas Partidas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
