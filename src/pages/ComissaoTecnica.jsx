import React, {useState} from 'react';
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
  
  const handleStaffClick = (nome, documento) => {
    setSelectedStaff({ nome, documento });
    setShowStaffOpcoes(true);
  };

  const staff = [
      { nome: 'Staff 1', documento: '123456789', cargo: 'Técnico' },
      { nome: 'Staff 2', documento: '987654321', cargo: 'Diretor' },
  ];
  
  const staffGrid = [
      { field: 'nome', headerText: 'Staff', width: '150', textAlign: 'Center', 
        template: ({nome, documento}) => (
        <a href="#" onClick={() => handleStaffClick(nome, documento)}>{nome}</a>
      )},
      { field: 'documento', headerText: 'Documento', width: '150', textAlign: 'Center' },
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
            currentColor={currentColor}  
            onClose={() => {
              setShowModal(false);
          }}/>

          <ModalStaffOpcoes 
            isVisible={showStaffOpcoes} 
            atleta={selectedStaff}
            staffNome={selectedStaff ? selectedStaff.nome : ''}
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