import React, { useState, useEffect } from 'react';
import { Header, Navbar, Footer, Sidebar, ThemeSettings, ModalCampos, Button, ModalCampoOpcoes } from '../components';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Search, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

const CamposTecnicos = () => {
    const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
    const [campos, setCampos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCampo, setSelectedCampo] = useState(null);
    const [showCampoOpcoes, setShowCampoOpcoes] = useState(false);


    useEffect(() => {
      const fetchCampos = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}campos/`);
          const data = await response.json();
          setCampos(data.data);
        } catch (error) {
          console.error("Erro ao buscar campos:", error);
        } 
      };
    
      fetchCampos();
    }, []); 
    
    
    useEffect(() => {
      console.log('Campos atualizados: ', campos);
    }, [campos]);
    


  const camposGrid = [
    {
      headerText: 'Imagem',
      template: ({ fileBase64 }) => (
        <div className='text-center'>
          <img src={fileBase64} alt="Imagem" style={{ width: '150px', height: '50px', borderRadius: '50%' }} />
        </div>
      ),
      textAlign: 'Center',
      width: '100'
    },
    {field: 'nome', headerText: 'Nome do Estádio', width: '150', textAlign: 'Center', 
    template: (campo) => (
        <a href="#" onClick={(e) => {
            e.preventDefault();
        }}>{campo.nome}</a>) },
    { field: 'endereco', headerText: 'Endereço', width: '200', textAlign: 'Center' },
    { field: 'cidade', headerText: 'Cidade', width: '200', textAlign: 'Center' },
    {
      field: 'linkMaps', headerText: 'Google Maps', width: '150', textAlign: 'Center',
      template: (campo) => (
        campo.linkMaps ? <a href={campo.linkMaps} target="_blank" rel="noopener noreferrer">{campo.linkMaps}</a> : <span>N/A</span>
      )
    }
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
            <div className='m-2 md:m-10 mt-24 p-2 
            md:p-10 bg-white rounded-3xl'>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Header category='Equipe' title='Campos' />
              </div>      
              <GridComponent
                dataSource={campos}
                allowPaging
                allowSorting
                toolbar={['Search']}
                width='auto'
              >
                <ColumnsDirective>
                  {camposGrid.map((item, index) => (
                    <ColumnDirective key={index} {...item}/>
                  ))}
                </ColumnsDirective>
                <Inject services={[Page, Search, Toolbar]}/>
              </GridComponent>
            </div>
          </div>
        </div>
      </div>
  );
}

export default CamposTecnicos;
