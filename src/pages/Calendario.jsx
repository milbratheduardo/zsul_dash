import React, { useEffect, useState } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, 
Day, Week, WorkWeek, Month, Agenda, Inject, Resize, 
DragAndDrop } from '@syncfusion/ej2-react-schedule';

import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { scheduleData } from '../data/dummy';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings } from '../components';


const Calendario = () => {
  const { activeMenu, themeSettings, setThemeSettings, 
    currentColor, currentMode } = useStateContext();
  
  const [jogos, setJogos] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchJogosEInformacoesAdicionais = async () => {
      const userId = user.data.id;
      const response = await fetch(`http://localhost:3000/jogos/team/${userId}`);
      const data = await response.json();
  
      if (data.status === 200) {
        const jogosComInfo = await Promise.all(data.data.map(jogo => fetchAdditionalInfo(jogo)));
        setJogos(jogosComInfo);
      }
    };
  
    fetchJogosEInformacoesAdicionais();
  }, []);
  
  const fetchAdditionalInfo = async (jogo) => {
    const campeonatoResponse = await fetch(`http://localhost:3000/campeonatos/${jogo.campeonatoId}`);
    const campeonatoData = await campeonatoResponse.json();
  
    const userCasaResponse = await fetch(`http://localhost:3000/users/${jogo.userIdCasa}`);
    const userCasaData = await userCasaResponse.json();
  
    const userForaResponse = await fetch(`http://localhost:3000/users/${jogo.userIdFora}`);
    const userForaData = await userForaResponse.json();
  
    const campeonatoName = campeonatoData?.data.name || 'Desconhecido';
    const teamNameCasa = userCasaData?.data.teamName || 'Equipe Casa Desconhecida';
    const teamNameFora = userForaData?.data.teamName || 'Equipe Fora Desconhecida';
  
    return {
      ...jogo,
      campeonatoName,
      teamNameCasa,
      teamNameFora
    };
  };
  

  const getScheduleData = () => {
    return jogos.map(jogo => {
      const dataFormatada = jogo.data.split('/').reverse().join('-');
      const startTime = new Date(`${dataFormatada}T${jogo.hora}:00`);
      const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));
      

      return {
        Id: jogo._id,
        Subject: `${jogo.campeonatoName}: ${jogo.teamNameCasa} vs ${jogo.teamNameFora}`,
        StartTime: startTime,
        EndTime: endTime,
        Location: jogo.local,
        Description: `Fase: ${jogo.tipo}`
      };
    });
  };


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
            <div className='m-2 md:m-10 mt-24 p-2 md:p-10 
            bg-white rounded-3xl'>
              <Header category='Administração' title='Calendário'/> 
              <ScheduleComponent 
                height='650px'
                eventSettings={{ dataSource: getScheduleData() }}
                selectedDate={new Date()}
              >
                <Inject services={[
                  Day, Week, WorkWeek, Month, Agenda, Resize,
                  DragAndDrop
                ]}/>
              </ScheduleComponent>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Calendario