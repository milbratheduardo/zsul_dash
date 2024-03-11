import React, { useState, useEffect } from 'react';
import { Header, Navbar, Footer, Sidebar, ThemeSettings, ModalCampos, Button } from '../components';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Search, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

const Campos = () => {
    const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
    const [campos, setCampos] = useState([]);
    const [showModal, setShowModal] = useState(false);


  const clubesGrid = [
    {field: 'teamName', headerText: 'Nome', width: '150', textAlign: 'Center', 
    template: (clube) => (
        <a href="#" onClick={(e) => {
            e.preventDefault();
            handleClubeClick(clube._id);
        }}>{clube.teamName}</a>) },
    { field: 'endereco', headerText: 'Endereço', width: '200', textAlign: 'Center' },
    { field: 'city', headerText: 'Cidade', width: '150', textAlign: 'Center' },
    { field: 'localizacao', headerText: 'Google Maps', width: '150', textAlign: 'Center' }
  ];

  
  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <div className='flex relative dark:bg-main-dark-bg'>
        <div className='fixed right-4 bottom-4' style={{ zIndex: '1000' }}>
          <TooltipComponent content="Opções" position='Top'>
            <button
              type='button'
              className='text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white'
              style={{ background: currentColor, borderRadius: '50%' }}
              onClick={() => setThemeSettings(true)}
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

          <ModalCampos
            isVisible={showModal} 
            currentColor={currentColor}  
            onClose={() => {
              setShowModal(false);
          }}/>

        {!showModal && (
            <div className='m-2 md:m-10 mt-24 p-2 
            md:p-10 bg-white rounded-3xl'>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Header category='Administrador' title='Campos' />
                <Button 
                  color='white'
                  bgColor={currentColor}
                  text='Adicionar Campo'
                  borderRadius='10px'
                  size='md'
                  onClick={() => {
                    setShowModal(true);
                  }}
                />
              </div>      
              <GridComponent
                dataSource={''}
                allowPaging
                allowSorting
                toolbar={['Search']}
                width='auto'
              >
                <ColumnsDirective>
                  {clubesGrid.map((item, index) => (
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
  );
}

export default Campos;
