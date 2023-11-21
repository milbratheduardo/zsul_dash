import React from 'react';
import { Button } from '../components';
import { earningData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const Home = () => {
  const { currentColor } = useStateContext();
  return (
    <div className='mt-12'>
      <div className='flex flex-wrap lg:flex-nowrap
      justify-center'>
        <div className='bg-white dark:text-gray-200
        dark:bg-secondary-dark-bg h-44 rounded-xl
        w-full lg:w-80 p-8 pt-9 m-3 
         bg-no-repeat bg-cover bg-center'> 
          <div className='flex justify-between items-center'>
            <div>
              <p className='font-bold text-gray-400'>
                Número de Atletas
              </p>
              <p className='text-2xl'>50</p>
            </div>
          </div>
          <div className='mt-6'>
            <Button 
              color='white'
              bgColor={currentColor}
              text='Download'
              borderRadius='10px'
              size='md'
            />
          </div>
        </div>

        <div className='flex m-3 flex-wrap justify-center 
        gap-1 items-center'>
          {earningData.map((item) => (
            <div 
              key={item.title}
              className='bg-white dark:text-gray-200 
              dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 
              rounded-2xl'>
                <button type='button' 
                style={{ color: item.iconColor, 
                backgroundColor: item.iconBg}}
                className='text-2xl opacity-0.9 rounded-full 
                p-4 hover:drop-shadow-xl'>
                  {item.icon}
                </button>
                <p className='mt-3'>
                  <span className='text-lg font-semibold'>
                    {item.amount}
                  </span>
                </p>
                <p className='text-sm text-gray-400 mt-1'>
                  {item.subtitle}
                </p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex gap-10 flex-wrap justify-center'>
        <div className='bg-white dark:text-gray-200 
        dark:bg-secondary-dark-bg p-4 m-3 rounded-2xl md:w-780'>
          <div className='flex justify-between'>
            <p className='font-semibold 
            text-xl'>Próximas Partidas</p>
            
          </div>
        </div>
      </div>

    </div>
  )
}

export default Home