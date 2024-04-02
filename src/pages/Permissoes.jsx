import React, {useEffect, useState} from 'react';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { GridComponent, ColumnsDirective, ColumnDirective,
  Page, Search, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings, Button } from '../components';
import { toast } from 'react-toastify';

const Permissoes = () => {
  const { activeMenu, themeSettings, setThemeSettings, 
    currentColor, currentMode } = useStateContext();
  const [permissoes, setPermissoes] = useState([]);

  useEffect(() => {
    const fetchPermissoes = async () => {
      try {
        const response = await fetch(` ${process.env.REACT_APP_API_URL}sumulaPermissao/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Permissoes: ', data)
        setPermissoes(data.data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
  
    fetchPermissoes();
  }, []);
  

    const TransferenciasGrid = [
      {
        field: 'elencoName',
        headerText: 'Nome do Jogador',
        width: '200',
        textAlign: 'Center',
      },
      {
        field: 'elencoCategoria', 
        headerText: 'Categoria do Atleta',
        width: '200',
        textAlign: 'Center',
        template:(atleta) => (<a>Sub-{atleta.elencoCategoria}</a>)
      },
      {
        field: 'userName',
        headerText: 'Time Atual',
        width: '150',
        textAlign: 'Center',
      },
      {
        field: 'campeonatoName', 
        headerText: 'Campeonato',
        width: '200',
        textAlign: 'Center',
      },
      {
        field: 'campeonatoCategoria',
        headerText: 'Categoria do Campeonato',
        width: '200',
        textAlign: 'Center',
        template:(atleta) => (<a>Sub-{atleta.campeonatoCategoria}</a>)
      },
      
      {
        headerText: 'Ações',
        width: '200',
        textAlign: 'Center',
        template: (rowData) => <ActionButtonTemplate permissao={rowData} />
      }
    ];

    const ActionButtonTemplate = ({ permissao }) => (
      <div style={{ textAlign: 'center' }}>
        <Button
          color='white'
          bgColor='green'
          text='Aceitar'
          borderRadius='10px'
          size='sm'
          style={{ marginRight: '10px' }}
          onClick={() => AprovarPermissao(permissao._id)}
        >
          Aceitar
        </Button>
        <Button
          color='white'
          bgColor='red'
          text='Reprovar'
          borderRadius='10px'
          size='sm'
          onClick={() => ReprovarPermissao(permissao._id)}
        >
          Reprovar
        </Button>
      </div>
    );
    
    

    const ReprovarPermissao = async (permissaoId) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}sumulaPermissao/reprovar/${permissaoId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Erro ao reprovar inscrição');
        }
        toast.success('Inscrição reprovada com sucesso!');
      } catch (error) {
        console.error('Erro ao reprovar inscrição:', error);
        toast.error(error.message);
      }
    };

    const AprovarPermissao = async (permissaoId) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}sumulaPermissao/aprovar/${permissaoId}`);
        if (!response.ok) {
          throw new Error('Erro ao aprovar inscrição');
        }
        toast.success('Inscrição Aprovada com sucesso!');
      } catch (error) {
        console.error('Erro ao Aprovar inscrição:', error);
        toast.error(error.message);
      }
    };
    
    
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
              <Header category="Administrador" title="Permissões"/>
              <GridComponent
                dataSource={permissoes}
                allowPaging
                allowSorting
                toolbar={['Search']}
                width='auto'
              >
                <ColumnsDirective>
                  {TransferenciasGrid.map((item, index) => (
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

export default Permissoes