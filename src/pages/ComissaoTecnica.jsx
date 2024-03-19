import React, {useState, useEffect} from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective,
Page, Search, Inject, Toolbar } from '@syncfusion/ej2-react-grids';

import { Header, Button, ModalStaff, ModalStaffOpcoes} from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings } from '../components';


const ComissaoTecnica = () => {
  const { activeMenu, themeSettings, setThemeSettings, 
    currentColor, currentMode } = useStateContext();
  
  const [showModal, setShowModal] =   useState(false);
  const [showStaffOpcoes, setShowStaffOpcoes] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const teamId = user.data.id || null;
  const [staff, setStaff] = useState([]);
  
  const handleStaffClick = (name, _id) => {
    console.log(`Staff ID: ${_id}`); // Mostra o ID no console
    setSelectedStaff({ name, id: _id }); // Se você quiser usar o ID depois, guarde-o aqui
    setShowStaffOpcoes(true);
  
    // Salva o ID no localStorage
    localStorage.setItem('selectedStaffId', _id);
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(` http://0.tcp.sa.ngrok.io:17723/staff/team/${teamId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStaff(data.data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    if (teamId) {
      fetchStaff();
    }
  }, [teamId]);

  const formatCPF = (cpf) => {
    if (typeof cpf === 'string') {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf || ''; 
  };
  
  
  const staffGrid = [

    {
      field: 'fotoStaffBase64', headerText: 'Imagem', width: '150', textAlign: 'Center',
      template: (rowData) => (
          <div style={{ display: 'flex', justifyContent: 'center', objectFit: 'cover' }}>
              <img src={rowData.fotoStaffBase64} alt={rowData.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
          </div>
      )
    },
    { field: 'name', headerText: 'Staff', width: '150', textAlign: 'Center', 
    template: ({name, _id}) => ( // Altere 'id' para '_id' aqui
      <a href="#" onClick={() => handleStaffClick(name, _id)}>{name}</a> // E aqui também
    )
  },
      {
        field: 'CPF',
        headerText: 'Documento',
        width: '150',
        textAlign: 'Center',
        template: (props) => <span>{formatCPF(props.CPF)}</span>,
      },
      { field: 'cargo', headerText: 'Cargo', width: '150', textAlign: 'Center' },


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

          <ModalStaff 
            isVisible={showModal} 
            teamId={teamId}
            currentColor={currentColor}  
            onClose={() => {
              setShowModal(false);
          }}/>

          <ModalStaffOpcoes 
            isVisible={showStaffOpcoes} 
            atleta={selectedStaff}
            staffNome={selectedStaff ? selectedStaff.name : ''}
            currentColor={currentColor}
            onClose={() => {
              setShowStaffOpcoes(false);
            }} 
          />
          {!showModal && !showStaffOpcoes && (
            <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Header category='Clube' title='Comissão Técnica' />
                <Button 
                  color='white'
                  bgColor={currentColor}
                  text='Adicionar Staff'
                  borderRadius='10px'
                  size='md'
                  onClick={() => {
                    setShowModal(true);
                  }}
                />
              </div>          
              

              <GridComponent
                dataSource={staff}
                allowPaging
                allowSorting
                toolbar={['Search']}
                width='auto'
            >
                <ColumnsDirective>
                    {staffGrid.map((item, index) => (
                        <ColumnDirective key={index} {...item}/>
                    ))}
                </ColumnsDirective>
                <Inject services={[Page, Search, Toolbar]}/>
            </GridComponent>         
              
            </div>
          )}
          </div>
        </div>
      </div>
  )
}

export default ComissaoTecnica