import React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Inject } from '@syncfusion/ej2-react-grids';
import { Header, Button, Sidebar, Navbar } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const CampeonatoDetalhes = () => {
  const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();

  const classificacaoData = [
    { posicao: 1, time: 'Internacional', pontos: 10, jogos: 5, vitorias: 3, empates: 1, derrotas: 1, gp: 7, gc: 2, sg: 5, ultimosJogos: ['v', 'v', 'e', 'd', 'v'] },
    // ...outros dados...
  ];

  const jogosData = [
    { rodada: '5ª Rodada', data: 'Hoje - 16:30', casa: 'Internacional', visitante: 'Grêmio', resultado: '2 x 0' },
    // ...outros dados...
  ];

  const classificacaoColumns = [
    { field: 'posicao', headerText: 'Posição', width: '100', textAlign: 'Center' },
    // ...outras colunas...
  ];

  const jogosColumns = [
    { field: 'rodada', headerText: 'Rodada', width: '120', textAlign: 'Center' },
    // ...outras colunas...
  ];

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <div className='flex relative dark:bg-main-dark-bg'>
        {activeMenu && (
          <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white z-10'>
            <Sidebar />
          </div>
        )}
        <div className={`flex-1 dark:bg-main-dark-bg bg-main-bg min-h-screen ${activeMenu ? 'md:ml-72' : ''}`}>
          <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full z-10'>
            <Navbar />
          </div>

          {themeSettings && <div className='fixed z-20'><ThemeSettings /></div>}

          <div className='m-2 md:m-10 mt-16 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category='Clube' title='Campeonato Pequeno Gigante' />
            <Button 
              color='white'
              bgColor={currentColor}
              text='Editar Campeonato'
              borderRadius='10px'
              size='md'
              className='my-4'
            />

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampeonatoDetalhes;
