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
  
  const handleStaffClick = (name, CPF) => {
    setSelectedStaff({ name, CPF });
    setShowStaffOpcoes(true);
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`http://localhost:3000/staff/team/${teamId}`);
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
  
  const staffGrid = [
      { field: 'name', headerText: 'Staff', width: '150', textAlign: 'Center', 
        template: ({name, CPF}) => (
        <a href="#" onClick={() => handleStaffClick(name, CPF)}>{name}</a>
      )},
      { field: 'CPF', headerText: 'Documento', width: '150', textAlign: 'Center' },
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