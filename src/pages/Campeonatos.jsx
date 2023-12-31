import React, {useState} from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Header, Navbar, Footer, Sidebar, ThemeSettings, Button, CardCompetition, ModalCompeticao} from '../components';



const Campeonatos = () => {
  const { activeMenu, themeSettings, setThemeSettings, 
    currentColor, currentMode } = useStateContext();
  
  const [showModal, setShowModal] =   useState(false);
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

            <ModalCompeticao
              isVisible={showModal} 
              currentColor={currentColor}  
              onClose={() => {
                setShowModal(false);
            }}/>
            <div className='m-2 md:m-10 p-2 md:p-10
            bg-white rounded-3xl'>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Header category='Clube' title='Campeonatos' />
                  <Button 
                      color='white'
                      bgColor={currentColor}
                      text='Criar Campeonato'
                      borderRadius='10px'
                      size='md'
                      onClick={() => {
                        setShowModal(true);
                      }}
                    />
               </div> 
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CardCompetition
                    image="url_da_imagem.jpg"
                    title="ZSUL de Verão"
                    category="Sub-15"
                    type="Grupos + Mata Mata"
                    participants="16"
                    vacancies="3"
                    date="15/01/2024"
                    city="Rio Grande"
                  />
              </div>  
            </div>
          </div>
        </div>
      </div>
  )
}

export default Campeonatos