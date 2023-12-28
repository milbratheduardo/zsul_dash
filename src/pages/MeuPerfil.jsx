import React from 'react';
import { Header, Navbar, Footer, Sidebar, ThemeSettings, Button } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

const MeuPerfil = () => {
  const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();

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
                    <div class="w-full px-4 text-center mt-20">
                      <div class="flex justify-center py-4 lg:pt-4 pt-8">
                        <div class="mr-4 p-3 text-center">
                          <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                            22
                          </span>
                          <span class="text-sm text-blueGray-400">Atletas</span>
                        </div>
                        <div class="mr-4 p-3 text-center">
                          <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                            10
                          </span>
                          <span class="text-sm text-blueGray-400">Staff</span>
                        </div>
                        <div class="lg:mr-4 p-3 text-center">
                          <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                            89
                          </span>
                          <span class="text-sm text-blueGray-400">Campeonatos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-center mt-12">
                    <h3 class="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                      Porto da Vila
                    </h3>
                    <div class="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                      <i class="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                      Rio Grande, RS
                    </div>
                    <div class="mb-2 text-blueGray-600 mt-10">
                      <i class="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                      teste@teste.com
                    </div>
                  </div>
                  <div class="mt-10 py-10 border-t border-blueGray-200 text-center">
                    <div class="flex flex-wrap justify-center">
                      <div class="w-full lg:w-9/12 px-4">
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