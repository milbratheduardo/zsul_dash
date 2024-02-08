import React, { useState, useEffect } from 'react';
import { Header, Navbar, Footer, Sidebar, ThemeSettings, ModalClubeOpcoes } from '../components';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Search, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

const Clubes = () => {
    const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
    const [clubes, setClubes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedClube, setSelectedClube] = useState(null);
    const [showClubesOpcoes, setShowClubesOpcoes] = useState(false);
    const [modalClube, setModalClube] = useState(null);
  
    useEffect(() => {
      const fetchClubes = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('http://localhost:3000/users/');
          const data = await response.json();
          console.log('Clubes: ', data);
          setClubes(data.data);
        } catch (error) {
          console.error("Erro ao buscar clubes:", error);
        } 
      };
  
      fetchClubes();
    }, []);
  
    const handleClubeClick = (_id) => {
      const clubeEncontrado = clubes.find(clube => clube._id === _id);
      if (clubeEncontrado) {
        console.log('Clube escolhido:', clubeEncontrado);
        setSelectedClube(clubeEncontrado);
        setShowClubesOpcoes(true);
      } else {
        console.error('Clube não encontrado para o ID:', _id);
      }
    };



  const clubesGrid = [
    {
      headerText: 'Logo',
      template: ({ pictureBase64 }) => (
        <div className='text-center'>
          <img src={pictureBase64} alt="Logo" style={{ width: '150px', height: '50px' }} />
        </div>
      ),
      textAlign: 'Center',
      width: '100'
    },
    {field: 'teamName', headerText: 'Nome', width: '150', textAlign: 'Center', 
    template: (clube) => (
        <a href="#" onClick={(e) => {
            e.preventDefault();
            handleClubeClick(clube._id);
        }}>{clube.teamName}</a>) },
    { field: 'email', headerText: 'Email', width: '200', textAlign: 'Center' },
    { field: 'city', headerText: 'Cidade', width: '150', textAlign: 'Center' },
    { field: 'state', headerText: 'Estado', width: '150', textAlign: 'Center' }
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

          
          <ModalClubeOpcoes 
                isVisible={showClubesOpcoes}
                teamId={selectedClube?._id} 
                clube={selectedClube} 
                clubeNome={selectedClube?.teamName} 
                onClose={() => setShowClubesOpcoes(false)} 
            />

            {!showClubesOpcoes && (
            <div className='m-2 md:m-10 mt-24 p-2 
            md:p-10 bg-white rounded-3xl'>
              <Header category="Administrador" title="Clubes"/>
              <GridComponent
                dataSource={clubes}
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

export default Clubes;
