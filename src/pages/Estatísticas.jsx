import React, { useEffect, useState } from 'react';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Search, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings } from '../components';

const Estatísticas = () => {
  const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
  
  const [campeonatos, setCampeonatos] = useState([]);
  const [selectedCampeonatoId, setSelectedCampeonatoId] = useState('');
  const [inscricoes, setInscricoes] = useState([]);
  const [selectedEstatistica, setSelectedEstatistica] = useState('');

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}campeonatos/`);
        const data = await response.json();
        console.log('Campeonatos: ', data);
        setCampeonatos(data.data); 
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    };

    fetchCampeonatos();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (selectedCampeonatoId) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}estatisticaJogador/campeonato/campeonato/${selectedCampeonatoId}`);
          const data = await response.json();
          setInscricoes(data.data);
        } catch (error) {
          console.error("Erro ao buscar inscrições:", error);
        }
      }
    };

    fetchStats();
  }, [selectedCampeonatoId]);

  console.log('Estatísticas: ', inscricoes)

  const handleCampeonatoChange = (event) => {
    setSelectedCampeonatoId(event.target.value);
    setSelectedEstatistica('');
    setInscricoes([]); 
  };

  const handleEstatisticaChange = (event) => {
    setSelectedEstatistica(event.target.value);
  };

  const filteredAndSortedInscricoes = inscricoes
    .filter(inscricao => {
      if (selectedEstatistica === 'gols') {
        return inscricao.gols > 0;
      } else if (selectedEstatistica === 'cartoes') {
        return inscricao.numeroCartoesAmarelo > 0 || inscricao.numeroCartoesVermelho > 0;
      }
      return false; 
    })
    .sort((a, b) => {
      if (selectedEstatistica === 'gols') {
        return b.gols - a.gols;
      } else if (selectedEstatistica === 'cartoes') {
        return b.numeroCartoesAmarelo - a.numeroCartoesAmarelo;
      }
      return 0;
    });

  const ControleGrid = [
    {
      field: 'teamName',
      headerText: 'Time',
      width: '200',
      textAlign: 'Center',
    },
    {
      field: 'jogadorName', 
      headerText: 'Atleta',
      width: '200',
      textAlign: 'Center',
    },
    {
      field: 'gols',
      headerText: 'Gols',
      width: '200',
      textAlign: 'Center',
      visible: selectedEstatistica === 'gols',
    },
    {
      field: 'numeroCartoesAmarelo', 
      headerText: 'Cartões Amarelos',
      width: '150',
      textAlign: 'Center',
      visible: selectedEstatistica === 'cartoes',
    },
    {
      field: 'numeroCartoesVermelho', 
      headerText: 'Cartões Vermelhos',
      width: '150',
      textAlign: 'Center',
      visible: selectedEstatistica === 'cartoes',
    },      
  ];

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
          <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category="Equipe" title="Estatísticas"/>
            
            <select onChange={handleCampeonatoChange} value={selectedCampeonatoId} className='mb-4'>
              <option value=''>Selecione um campeonato</option>
              {campeonatos.map((campeonato) => (
                <option key={campeonato._id} value={campeonato._id}>{campeonato.name}</option>
              ))}
            </select>
            
            <select onChange={handleEstatisticaChange} value={selectedEstatistica} className='mb-4' disabled={!selectedCampeonatoId}>
              <option value=''>Selecione uma estatística</option>
              <option value='gols'>Gols</option>
              <option value='cartoes'>Cartões</option>
            </select>
            
            <GridComponent
              dataSource={selectedEstatistica ? filteredAndSortedInscricoes : []}
              allowPaging
              allowSorting
              toolbar={['Search']}
              width='auto'
            >
              <ColumnsDirective>
                {ControleGrid.filter(item => item.field === 'teamName' || item.field === 'jogadorName' || item.visible).map((item, index) => (
                  <ColumnDirective key={index} {...item}/>
                ))}
              </ColumnsDirective>
              <Inject services={[Page, Search, Toolbar]}/>
            </GridComponent> 
          </div>
        </div>
      </div>
    </div>
  )
}

export default Estatísticas;
