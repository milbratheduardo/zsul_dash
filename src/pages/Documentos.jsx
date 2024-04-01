import React, { useState, useEffect } from 'react'; 
import { GridComponent, ColumnsDirective, ColumnDirective,
  Page, Search, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { Header, Button, ModalAtleta, ModalAtletaDocumentos,  } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings } from '../components';

const Documentos = () => {
  const { activeMenu, themeSettings, setThemeSettings, 
    currentColor, currentMode } = useStateContext();
  const [showModalDocumentos, setShowModalDocumentos] = useState(false);
  const [selectedAtleta, setSelectedAtleta] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const teamId = user.data.id || null;
  const [atletas, setAtletas] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedAtletaData, setSelectedAtletaData] = useState({
    Nome: '',
    FotoBase64: '',
    RGFrenteBase64: '',
    RGVersoBase64: '',
    CPF: '',
    teamId:''
  });

  const handleAtletaClick = (atleta) => {
    console.log('Dados do Atleta:', atleta); 
    const documentoIdentificacao = atleta.RG ? atleta.RG : atleta.CPF;
  
    const atletaDados = {
      Nome: atleta.name,
      FotoBase64: atleta.fotoAtletaBase64,
      RGFrenteBase64: atleta.RGFrenteBase64,
      RGVersoBase64: atleta.RGVersoBase64,
      RG: documentoIdentificacao,
      Id: atleta._id
    };
  
    setSelectedAtletaData({
      Nome: atleta.name,
      FotoBase64: atleta.fotoAtletaBase64,
      RGFrenteBase64: atleta.RGFrenteBase64,
      RGVersoBase64: atleta.RGVersoBase64,
      RG: documentoIdentificacao,
    });
  
    setSelectedAtleta(atleta);
    setShowModalDocumentos(true);
    console.log(atletaDados)
    localStorage.setItem('selectedAtletaId', atleta._id);
    localStorage.setItem('selectedTeamId', atleta.teamId); 
  };
  


  useEffect(() => {
    const fetchAtletas = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}elenco/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
  
        const atletasWithTeamName = await Promise.all(data.data.map(async (atleta) => {
          try {
            const teamResponse = await fetch(`${process.env.REACT_APP_API_URL}users/${atleta.teamId}`);
            if (!teamResponse.ok) {
              console.error(`Error fetching team data for teamId ${atleta.teamId}: ${teamResponse.statusText}`);
              return null; 
            }
            const teamData = await teamResponse.json();
            if (!teamData || Object.keys(teamData).length === 0) {
              console.error(`No team data returned for teamId ${atleta.teamId}`);
              return null; 
            }
            const teamName = teamData.data.teamName; 
            return { ...atleta, teamName }; 
          } catch (error) {
            console.error(`Failed to process team data for teamId ${atleta.teamId}:`, error);
            return null; 
          }
        }));
  
        
        const filteredAtletasWithTeamName = atletasWithTeamName.filter(atleta => atleta !== null);
  
        setAtletas(filteredAtletasWithTeamName);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };   
  
  
    const loadData = async () => {
      setLoading(true); 
      await Promise.all([fetchAtletas()]);
      setLoading(false); 
    };
  
    if (teamId) {
      loadData();
    }  else {
      console.log('teamId is not defined');
    }
  }, [teamId]);
  
  const formatCPF = (cpf) => {
    if (typeof cpf === 'string') {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf || ''; 
  };

  const atletasGrid = [
    {
      headerText: 'Foto',
      template: ({ fotoAtletaBase64 }) => (
        <div className='text-center' style={{ display: 'flex', justifyContent: 'center', objectFit: 'cover' }}>
          <img src={fotoAtletaBase64} alt="Foto Atleta" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
        </div>
      ),
      textAlign: 'Center',
      width: '100'
    },
    {
      field: 'name',
      headerText: 'Atleta',
      width: '150',
      textAlign: 'Center',
      template: (atleta) => (
        <a href="#" onClick={(e) => {
          e.preventDefault();
          handleAtletaClick(atleta); 
        }}>{atleta.name}</a>
      )
    },
    {
      field: 'CPF',
      headerText: 'Documento',
      width: '150',
      textAlign: 'Center',
      template: (props) => <span>{props.RG || formatCPF(props.CPF)}</span>,
    },
    {
      field: 'teamName',
      headerText: 'Clube',
      width: '150',
      textAlign: 'Center'
    },
    { field: 'category', headerText: 'Categoria', width: '150', textAlign: 'Center' },
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
          
          <ModalAtletaDocumentos 
            isVisible={showModalDocumentos} 
            atleta={selectedAtleta}
            atletaNome={selectedAtleta ? selectedAtleta.name : ''}
            currentColor={currentColor}
            onClose={() => {
              setShowModalDocumentos(false);
            }}
            /> 
          
          {!showModalDocumentos && (
            <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Header category='Administrador' title='Documentos' />
              </div> 
              {loading ? (
                <div>Carregando...</div>
                ) : (            
              <GridComponent
                dataSource={atletas}
                allowPaging
                allowSorting
                toolbar={['Search']}
                width='auto'
              >
                <ColumnsDirective>
                  {atletasGrid.map((item, index) => (
                    <ColumnDirective key={index} {...item} />
                  ))}
                </ColumnsDirective>
                <Inject services={[Page, Search, Toolbar]} />
              </GridComponent>           
              )}
            </div>
          )}            
          </div>
        </div>
      </div>
  );
}

export default Documentos;
