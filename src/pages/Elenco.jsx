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

  

  const handleAtletaClick = (name, CPF) => {
    setSelectedAtleta({ name, CPF });
    setShowAtletasOpcoes(true);
  };

  useEffect(() => {
    const fetchAtletas = async () => {
      try {
        const response = await fetch(`http://localhost:3000/elenco/team/${teamId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAtletas(data.data);
        console.log('Atletas: ', data)
        data.data.forEach(atleta => {
          fetchImageForAtleta(atleta.userId);
        });
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    if (teamId) {
      fetchAtletas();
    }
  }, [teamId]);

  const atletasGrid = [
    {
      headerText: 'Foto',
      template: ({ fotoAtleta }) => (
        <div className='text-center'>
          <img src={fotoAtleta} alt="Foto Atleta" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
        </div>
      ),
      textAlign: 'Center',
      width: '100'
    },
    { field: 'name', headerText: 'Atleta', width: '150', textAlign: 'Center', 
      template: ({ name, CPF }) => (
        <a href="#" onClick={() => handleAtletaClick(name, CPF)}>{name}</a>
      )
    },
    { field: 'CPF', headerText: 'Documento', width: '150', textAlign: 'Center' },
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
             
       
              

              <GridComponent
                dataSource={atletas}
                allowPaging
                allowSorting
                toolbar={['Search']}
                width='auto'
              >
                <ColumnsDirective>
                  {atletasGrid.map((item, index) => (
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

export default Elenco;
