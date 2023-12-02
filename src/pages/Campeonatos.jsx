import React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, 
Page, Selection, Inject, Edit, Toolbar, 
Sort, Filter } from '@syncfusion/ej2-react-grids/src';

import { customersData, customersGrid } from '../data/dummy';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings } from '../components';



const Campeonatos = () => {
  const { activeMenu, themeSettings, setThemeSettings, 
    currentColor, currentMode } = useStateContext();
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
            <div className='m-2 md:m-10 p-2 md:p-10
            bg-white rounded-3xl'>
              <Header category='Clube' title='Campeonatos' />
              <GridComponent
                dataSource={customersData}
                allowPaging
                allowSorting
                toolbar={['Delete']}
                editSettings={{allowDeleting: true, allowEditing: true}}
                width='auto'
              >
                <ColumnsDirective>
                  {customersGrid.map((item, index) => (
                    <ColumnDirective key={index} {...item}/>
                  ))}
                </ColumnsDirective>
                <Inject services={[Page, Toolbar, Selection, Edit,
                Sort, Filter]}/>
              </GridComponent>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Campeonatos