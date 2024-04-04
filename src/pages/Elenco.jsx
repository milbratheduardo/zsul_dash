import React, { useState, useEffect } from 'react'; 
import { GridComponent, ColumnsDirective, ColumnDirective,
  Page, Search, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { Header, Button, ModalAtleta, ModalAtletasOpcoes,  } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings } from '../components';

const Elenco = () => {
  const { activeMenu, themeSettings, setThemeSettings, 
    currentColor, currentMode } = useStateContext();
  const [showModal, setShowModal] = useState(false);
  const [showAtletasOpcoes, setShowAtletasOpcoes] = useState(false);
  const [selectedAtleta, setSelectedAtleta] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const teamId = user.data.id || null;
  const [atletas, setAtletas] = useState([]);
  const [transferencias, setTransferencias] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('id', teamId)
  const [selectedAtletaData, setSelectedAtletaData] = useState({
    name: '',
    dateOfBirth: '',
    fotoAtletaBase64: '',
    CPF: '',
  });

  const handleAtletaClick = (atleta) => {
    console.log('Dados do Atleta:', atleta); 
    const atletaDados = {
      Nome: atleta.name,
      DataDeNascimento: atleta.dateOfBirth,
      FotoBase64: atleta.fotoAtletaBase64,
      CPF: atleta.CPF,
      Id:atleta._id
    };
    setSelectedAtletaData({
      name: atleta.name,
      dateOfBirth: atleta.dateOfBirth,
      fotoAtletaBase64: atleta.fotoAtletaBase64,
      CPF: atleta.CPF,
    });
    setSelectedAtleta(atleta);
    setShowAtletasOpcoes(true);
    console.log(atletaDados)
    localStorage.setItem('selectedAtletaId', atleta._id);
    localStorage.setItem('selectedTeamId', teamId); 
  };

  useEffect(() => {
    const fetchAtletas = async () => {
      try {
        const response = await fetch(` ${process.env.REACT_APP_API_URL}elenco/team/${teamId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('data: ', data)
        setAtletas(data.data[0]);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
  
    const fetchTransferencias = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}transferencia/`);
        if (!res.ok) throw new Error('Erro ao buscar transferências');
        const result = await res.json();
        setTransferencias(result.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    const loadData = async () => {
      setLoading(true); 
      await Promise.all([fetchAtletas(), fetchTransferencias()]);
      setLoading(false); 
    };
  
    if (teamId) {
      loadData();
    }
  }, [teamId]); 
   


  const rowDataBound = (args) => {
    const isTransferido = transferencias.some(transf => transf.jogadorId === args.data._id);
    if (isTransferido) {
      args.row.style.backgroundColor = 'yellow';
    }
  };
  

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
        <div className='text-center' style={{display: 'flex', justifyContent: 'center', objectFit: 'cover' }}>
          <img src={fotoAtletaBase64} alt="Foto Atleta" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
        </div>
      ),
      textAlign: 'Center',
      width: '100'
    },
    {
      field: 'name', headerText: 'Atleta', width: '150', textAlign: 'Center', 
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
    { field: 'category', headerText: 'Categoria', width: '150', textAlign: 'Center', template:(atleta) => (<a>Sub-{atleta.category}</a>)},
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
          
          <ModalAtleta 
            isVisible={showModal} 
            currentColor={currentColor} 
            teamId = {teamId} 
            onClose={() => {
              setShowModal(false);
          }}/>
          <ModalAtletasOpcoes 
            isVisible={showAtletasOpcoes} 
            atleta={selectedAtleta}
            atletaNome={selectedAtleta ? selectedAtleta.name : ''}
            currentColor={currentColor}
            teamId = {teamId}
            onClose={() => {
              setShowAtletasOpcoes(false);
            }} 
          />
          
          {!showModal && !showAtletasOpcoes && (
            <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Header category='Clube' title='Elenco' />
                <Button 
                  color='white'
                  bgColor={currentColor}
                  text='Adicionar Atleta'
                  borderRadius='10px'
                  size='md'
                  onClick={() => {
                    setShowModal(true);
                  }}
                />
              </div> 
              {loading ? (
                <div>Carregando...</div> // Ou um componente de Spinner
                ) : (            
              <GridComponent
                dataSource={atletas}
                allowPaging
                allowSorting
                toolbar={['Search']}
                width='auto'
                rowDataBound={rowDataBound} // Adiciona o manipulador de evento aqui
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

export default Elenco;
