import React, { useEffect, useState} from 'react';
import { Header, Navbar, Footer, Sidebar, ThemeSettings, Button } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

const MeuPerfil = () => {
  const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
  const [userInfo, setUserInfo] = useState({});
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = user.data.id;
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
       
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
          console.log(data);
        } else {
          console.error('Erro ao buscar dados do usuário');
        }
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    };

    if (user.data.id) {
      fetchUserInfo();
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
              style={{ background: currentColor, borderRadius: '50%' }}
              onClick={() => setThemeSettings(true)}
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
          className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'}`}
        >
          <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
            <Navbar />
          </div>

          {themeSettings && <ThemeSettings />}

          <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Header category='Perfil' title='Meu Perfil' />
              <Button 
                  color='white'
                  bgColor={currentColor}
                  text='Editar Perfil'
                  borderRadius='10px'
                  size='md'
                  onClick={() => {
                    
                  }}
                />
            </div>
            <div className="w-full lg:w-4/12 px-4 mx-auto">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
                <div className="px-6">
                  <div className="flex flex-wrap justify-center text-center">
                    <div className="w-full px-4 flex justify-center">
                    <div className="relative">
                      <img alt="Perfil" src="https://via.placeholder.com/150" className="shadow-xl rounded-full h-auto align-middle border-none max-w-150-px" />
                    </div>
                    </div>
                  </div>
                  <div className="text-center mt-12">
                    <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                    {userInfo.data.teamName || 'Carregando...'}
                    </h3>
                    <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                      {userInfo.data.city || 'Carregando...'}
                    </div>
                    <div className="mb-2 text-blueGray-600 mt-10">
                      {userInfo.data.email || 'Carregando...'}
                    </div>
                  </div>
                  <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full lg:w-9/12 px-4">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default MeuPerfil