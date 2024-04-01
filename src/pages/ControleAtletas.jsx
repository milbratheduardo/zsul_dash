import React, {useEffect, useState} from 'react';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { GridComponent, ColumnsDirective, ColumnDirective,
  Page, Search, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings } from '../components';


const ControleAtletas = () => {
  const { activeMenu, themeSettings, setThemeSettings, 
    currentColor, currentMode } = useStateContext();
  
    const [campeonatos, setCampeonatos] = useState([]);
    const [selectedCampeonatoId, setSelectedCampeonatoId] = useState('');
    const [inscricoes, setInscricoes] = useState([]);
    const [clubes, setClubes] = useState([]);
    const [selectedClubeId, setSelectedClubeId] = useState('');
    const [totalInscricoes, setTotalInscricoes] = useState(0);

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
      const fetchInscricoes = async () => {
        if (selectedCampeonatoId) {
          try {
            const response = await fetch(` ${process.env.REACT_APP_API_URL}inscricoes/campeonato/${selectedCampeonatoId}`);
            const data = await response.json();
            setInscricoes(data.data);
          } catch (error) {
            console.error("Erro ao buscar inscrições:", error);
          }
        }
      };
  
      fetchInscricoes();
    }, [selectedCampeonatoId]);

    const handleCampeonatoChange = (event) => {
      setSelectedCampeonatoId(event.target.value);
    };

    useEffect(() => {
      const fetchClubes = async () => {
        if (selectedCampeonatoId) {
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}inscricoes/campeonato/${selectedCampeonatoId}`);
            const data = await response.json();
            setClubes(data.data); 
          } catch (error) {
            console.error("Erro ao buscar clubes:", error);
          }
        } else {
          setClubes([]); 
        }
      };
  
      fetchClubes();
    }, [selectedCampeonatoId]); 
  
    const handleClubeChange = (event) => {
      setSelectedClubeId(event.target.value);
    };


    useEffect(() => {
      const fetchSumulas = async () => {
        
        if (selectedClubeId && selectedCampeonatoId) {
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}sumula/team/${selectedClubeId}`);
            const data = await response.json();
            
            
            const sumulasFiltradas = data.data.filter(sumula => sumula.campeonatoId === selectedCampeonatoId);
    
            setInscricoes(sumulasFiltradas);
            setTotalInscricoes(sumulasFiltradas.length * 35);
          } catch (error) {
            console.error("Erro ao buscar súmulas:", error);
            setInscricoes([]); 
          }
        } else {
          setInscricoes([]); 
        }
      };
    
      fetchSumulas();
    }, [selectedClubeId, selectedCampeonatoId]);
    
    

    console.log('Jogadores: ', inscricoes)

  

    const ControleGrid = [
      {
        headerText: 'Foto',
        template: ({ fotoAtletaBase64 } = {}) => ( 
        <div className='text-center'>
          {fotoAtletaBase64 ? 
            <img src={fotoAtletaBase64} alt="Foto Atleta" style={{ width: '50px', height: '50px', borderRadius: '50%' }} /> :
            <span>Sem foto</span> 
          }
        </div>
      ),
        textAlign: 'Center',
        width: '100'
      },
      {
        field: 'elencoName', 
        headerText: 'Atleta', 
        width: '150', 
        textAlign: 'Center',
        template: (rowData) => (
          rowData ? <span>{rowData.elencoName}</span> : <span>--</span> 
        )
      },
      {
        field: 'elencoDocumento',
        headerText: 'Documento',
        width: '150',
        textAlign: 'Center',
      },
      { 
        field: 'category', 
        headerText: 'Categoria', 
        width: '150', 
        textAlign: 'Center',
      },
      {
        field: 'status',
        headerText: 'Status',
        width: '150',
        textAlign: 'Center',
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
          className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
            activeMenu ? 'md:ml-72' : 'flex-2'
          }`}
        >
          <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
            <Navbar />
          </div>

          {themeSettings && <ThemeSettings />}
            <div className='m-2 md:m-10 mt-24 p-2 
            md:p-10 bg-white rounded-3xl'>
              <Header category="Administrador" title="Controle de Atletas" subtitle={`(Valor a ser Pago pela Equipe: R$ ${totalInscricoes})`}/>
              <select onChange={handleCampeonatoChange} value={selectedCampeonatoId} className='mb-4'>
                <option value=''>Selecione um campeonato</option>
                {campeonatos.map((campeonato) => (
                  <option key={campeonato._id} value={campeonato._id}>{campeonato.name}</option>
                ))}
              </select>

              <select onChange={handleClubeChange} value={selectedClubeId} className='mb-4'>
                <option value=''>Selecione um clube</option>
                {clubes.map((clube) => (
                  <option key={clube.userId} value={clube.userId}>{clube.userName}</option>
                ))}
              </select>
              <GridComponent
                 dataSource={selectedClubeId && selectedCampeonatoId && inscricoes ? inscricoes : []}
                allowPaging
                allowSorting
                toolbar={['Search']}
                width='auto'
              >
                <ColumnsDirective>
                  {ControleGrid.map((item, index) => (
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

export default ControleAtletas