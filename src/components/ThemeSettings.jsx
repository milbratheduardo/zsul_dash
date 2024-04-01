import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { BsCheck } from 'react-icons/bs';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { themeColors } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';



const ThemeSettings = () => {
  const {setColor, setMode, currentMode, currentColor, 
  setThemeSettings } = useStateContext();

  return (
    <div className='bg-half-transparent w-screen fixed 
    nav-item top-0 right-0'>
      <div className='float-right h-screen
       dark:text-gray-400 bg-white dark:[#484B52]
       w-400'>
        <div className='flex justify-between items-center 
        p-4 ml-4'>
          <p className='font-semibold text-xl'>
            Configurações
          </p>
          <button
            type='button'
            onClick={() => setThemeSettings(false)}
            style={{ color: 'rgb(153, 171, 180)', 
            borderRadius: '50%'}}
            className='text-2xl p-3 hover:drop-shadow-xl 
            hover:bg-light-gray'
          >
            <MdOutlineCancel />
          </button>
        </div>
        
        <div className='flex-col border-t-1 border-color 
        p-4 ml-4'>
          <p className='font-semibold text-lg'>Opções de Tema</p>

          <div className='mt-4'>
            <input
              type='radio'
              id="light"
              name='theme'
              value='Light'
              className='cursor-pointer'
              onChange={setMode}
              checked={currentMode === 'Light'}
            />
            <label htmlFor='light' 
            className='ml-2 text-md cursor-pointer'>
              Claro
            </label>

          </div>

          <div className='mt-4'>
            <input
              type='radio'
              id="dark"
              name='theme'
              value='Dark'
              className='cursor-pointer'
              onChange={setMode}
              checked={currentMode === 'Dark'}
            />
            <label htmlFor='dark' 
            className='ml-2 text-md cursor-pointer'>
              Escuro
            </label>

          </div>
        </div>

        <div className='flex-col border-t-1 border-color 
          p-4 ml-4'>
          <p className='font-semibold text-lg'>Cores do Sistema</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '2rem'
          }}>
            {themeColors.map((item, index) => (
              <TooltipComponent key={index}
                content={item.name}
                position='TopCenter'
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <button
                    type='button'
                    style={{
                      height: '40px',
                      width: '40px',
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    onClick={() => setColor(item.color)}
                  >
                    <BsCheck style={{
                      color: 'white',
                      fontSize: '24px',
                      display: item.color === currentColor ? 'block' : 'none'
                    }} />
                  </button>
                </div>
              </TooltipComponent>
            ))}
          </div>

        </div>  
      </div>
    </div>
  )
}

export default ThemeSettings