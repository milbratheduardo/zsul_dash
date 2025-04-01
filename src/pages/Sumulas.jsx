import React, { useState, useEffect } from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Header, Navbar, Footer, Sidebar, ThemeSettings, CardSumulas } from '../components';

const Sumulas = () => {
  const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
  const [campeonatos, setCampeonatos] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const teamId = user.data.id;

  useEffect(() => {
    const fetchCampeonatosInscritos = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}inscricoes/`);
        const data = await response.json();
        console.log('Inscrições: ', data);
        
        // Filtrar os campeonatos pelo userId
        const inscricoes = data.data.filter(inscricao => inscricao.userId === teamId);
        console.log('Inscrições do Usuário: ', inscricoes);

        // Buscar detalhes dos campeonatos
        const campeonatosDetailsPromises = inscricoes.map(inscricao =>
          fetch(`${process.env.REACT_APP_API_URL}campeonatos/${inscricao.campeonatoId}`).then(res => res.json())
        );

        const campeonatosDetails = await Promise.all(campeonatosDetailsPromises);
        const validCampeonatos = campeonatosDetails.map(detail => detail.data).filter(detail => detail != null);
        
        if (validCampeonatos.length > 0) {
          console.log('Campeonatos válidos: ', validCampeonatos);
          setCampeonatos(validCampeonatos.reverse());
        } else {
          console.log('Nenhum campeonato válido encontrado.');
          setCampeonatos([]);
        }
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    };

    fetchCampeonatosInscritos();
  }, [teamId]);

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
          className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'}`}
        >
          <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
            <Navbar />
          </div>

          {themeSettings && <ThemeSettings />}

          <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Header category='Clube' title='Campeonatos Inscritos' />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campeonatos.map(campeonato => (
                <CardSumulas
                  key={campeonato._id}
                  image={campeonato.pictureBase64}
                  title={campeonato.name}
                  category={campeonato.categoria}
                  type={campeonato.tipoCompeticao}
                  participants={campeonato.participantes}
                  vacancies={campeonato.vagas}
                  date={campeonato.dataInicio}
                  city={campeonato.cidade}
                  currentColor={currentColor}
                  id={campeonato._id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sumulas;
