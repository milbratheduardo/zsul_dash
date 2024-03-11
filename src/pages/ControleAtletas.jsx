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

  

    const ControleGrid = [
      {
        field: 'teamName',
        headerText: 'Time',
        width: '200',
        textAlign: 'Center',
      },
      {
        field: 'atletasInscritos', 
        headerText: 'Atletas Inscritos',
        width: '200',
        textAlign: 'Center',
      },
      {
        field: '19-30',
        headerText: '19-30',
        width: '200',
        textAlign: 'Center',
      },
      {
        field: 'troca', 
        headerText: 'Troca',
        width: '150',
        textAlign: 'Center',
      },
      {
        field: 'valorpagar', 
        headerText: 'Valor a Pagar',
        width: '150',
        textAlign: 'Center',
      },
      {
        field: 'valorpago', 
        headerText: 'Valor Pago',
        width: '150',
        textAlign: 'Center',
      },
      {
        field: 'faltam', 
        headerText: 'Faltam',
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
              <Header category="Administrador" title="Controle de Atletas"/>
              <GridComponent
                dataSource={''}
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