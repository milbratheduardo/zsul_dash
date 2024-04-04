import React, {useEffect, useState} from 'react';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { GridComponent, ColumnsDirective, ColumnDirective,
  Page, Search, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings, Button } from '../components';
import { toast } from 'react-toastify';

const Transferencias = () => {
  const { activeMenu, themeSettings, setThemeSettings, 
    currentColor, currentMode } = useStateContext();
  const [transferencias, setTransferencias] = useState([]);

  useEffect(() => {
    const fetchTransferencias = async () => {
      try {
        const response = await fetch(` ${process.env.REACT_APP_API_URL}transferencia/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        const promises = data.data.map(async (transferencia) => {
          const responseTime = await fetch(` ${process.env.REACT_APP_API_URL}users/${transferencia.novoTimeId}`);
          if (!responseTime.ok) {
            console.error('Erro ao buscar nome do time para o ID:', transferencia.novoTimeId);
            return transferencia; 
          }
          const dataTime = await responseTime.json();
          console.log('Time: ', dataTime)
          return { ...transferencia, novoTimeNome: dataTime.data.teamName }; 
        });

        const transferenciasComNomes = await Promise.all(promises);
  
        setTransferencias(transferenciasComNomes);
        console.log('Transferencias com nomes dos times: ', transferenciasComNomes);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
  
    fetchTransferencias();
  }, []);
  

    const TransferenciasGrid = [
      {
        field: 'jogadorNome',
        headerText: 'Nome do Jogador',
        width: '200',
        textAlign: 'Center',
      },
      {
        field: 'nomeTime',
        headerText: 'Time Atual',
        width: '150',
        textAlign: 'Center',
      },
      {
        field: 'novoTimeNome', 
        headerText: 'Time de Destino',
        width: '200',
        textAlign: 'Center',
      },
      {
        field: 'motivo',
        headerText: 'Motivo da Transferência',
        width: '200',
        textAlign: 'Center',
      },
      {
        field: 'dataDeSolicitacao', 
        headerText: 'Data da Solicitação',
        width: '200',
        textAlign: 'Center',
      },
      {
        headerText: 'Ações',
        width: '200',
        textAlign: 'Center',
        template: (rowData) => <ActionButtonTemplate transferencia={rowData} />
      }
    ];

    const ActionButtonTemplate = ({ transferencia }) => (
      <div style={{ textAlign: 'center' }}>
        <Button
          color='white'
          bgColor='green'
          text='Aceitar'
          borderRadius='10px'
          size='sm'
          style={{ marginRight: '10px' }}
          onClick={() => AprovarTransferencia(transferencia._id)}
        >
          Aceitar
        </Button>
        <Button
          color='white'
          bgColor='red'
          text='Reprovar'
          borderRadius='10px'
          size='sm'
          onClick={() => ReprovarTransferencia(transferencia._id)}
        >
          Reprovar
        </Button>
      </div>
    );
    
    

    const ReprovarTransferencia = async (transferenciaId) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}transferencia/reprovar/${transferenciaId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Erro ao reprovar transferência');
        }
        toast.success('Transferência reprovada com sucesso!', {
          position: "top-center",
          autoClose: 5000,
          onClose: (() => navigate(`/transferencias`),            
            window.location.reload())
        });
      } catch (error) {
        console.error('Erro ao reprovar transferência:', error);
        toast.error(error.message);
      }
    };

    const AprovarTransferencia = async (transferenciaId) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}transferencia/aprovar/${transferenciaId}`);
        if (!response.ok) {
          throw new Error('Erro ao aprovar transferência');
        }
        toast.success('Transferência Aprovada com sucesso!', {
          position: "top-center",
          autoClose: 5000,
          onClose: (() => navigate(`/transferencias`,            
            window.location.reload()))
        });
      } catch (error) {
        console.error('Erro ao Aprovar transferência:', error);
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
              <Header category="Administrador" title="Transferências"/>
              <GridComponent
                dataSource={transferencias}
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

export default Transferencias