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

    const handleStatusChange = async (clube, newStatus) => {
      try {
        const responseGet = await fetch(`https://zsul-api.onrender.com/users/${clube._id}`);
        if (!responseGet.ok) {
          throw new Error('Erro ao obter o ID do Usuário');
        }
        const dataGet = await responseGet.json();
        console.log('Response GET:', dataGet);  

        const body = {
          userIdRequesting: "65f39396a540cfb413056b43",
          field: 'permission',
          value: newStatus,
        };
    
        const responsePatch = await fetch(`https://zsul-api.onrender.com/users/${clube._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
    
        if (!responsePatch.ok) {
          throw new Error('Erro ao atualizar o status do atleta');
        }
    
        const updatedClubes = clubes.map((a) => {
          if (a._id === clube._id) {
            return { ...a, permission: newStatus };
          }
          return a;
        });
    
        setClubes(updatedClubes);
        window.location.reload()
      } catch (error) {
        console.error('Erro ao atualizar o status do atleta:', error);
      }
    };
  
    useEffect(() => {
      const fetchClubes = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(' https://zsul-api.onrender.com/users/');
          const data = await response.json();
          setClubes(data.data);
          console.log('Clubes: ', clubes);
        } catch (error) {
          console.error("Erro ao buscar clubes:", error);
        } 
      };
  
      fetchClubes();
    }, []);

    useEffect(() => {
      console.log('Clubes atualizados:', clubes);
    }, [clubes]);
    
  
    const handleClubeClick = async (_id) => {
      console.log("Id Click: ", _id);
      setIsLoading(true);
    
      try {
        const response = await fetch(' https://zsul-api.onrender.com/users/');
        const data = await response.json();
        const clubesAtualizados = data.data;
    
        const clubeEncontrado = clubesAtualizados.find(clube => clube._id === _id);
        if (clubeEncontrado) {
          console.log('Clube escolhido:', clubeEncontrado);
          setSelectedClube(clubeEncontrado);
          setShowClubesOpcoes(true);
        } else {
          console.error('Clube não encontrado para o ID:', _id);
        }
      } catch (error) {
        console.error("Erro ao buscar clubes:", error);
      } finally {
        setIsLoading(false);
      }
    };  



  const clubesGrid = [
    {
      headerText: 'Logo',
      template: ({ pictureBase64 }) => (
        <div className='text-center'>
          <img src={pictureBase64} alt="Logo" style={{ width: '150px', height: '50px', borderRadius: '50%' }} />
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
    { field: 'state', headerText: 'Estado', width: '150', textAlign: 'Center' },
    {
      field: 'permission',
      headerText: 'Tipo de Usuário',
      width: '150',
      textAlign: 'Center',
      template: (clube) => (
        <select
          value={clube.permission}
          onChange={(e) => handleStatusChange(clube, e.target.value)}
        >
          <option value="admin">Administrador</option>
          <option value="TEquipe">Equipe</option>
        </select>
      ),
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
            picture={selectedClube?.pictureBase64}
            clubeNome={selectedClube?.teamName}
            mail = {selectedClube?.email}
            onClose={() => {
              setShowClubesOpcoes(false); 
            }}
          />

            {!showClubesOpcoes && (
            <div className='m-2 md:m-10 mt-24 p-2 
            md:p-10 bg-white rounded-3xl'>
              <Header category="Administrador" title="Usuários"/>
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
