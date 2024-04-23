import React, { useEffect, useState } from 'react';
import { Header, Navbar, Footer, Sidebar, ThemeSettings } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Search, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

const Punicoes = () => {
  const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
  const [punicoes, setPunicoes] = useState([]);

  useEffect(() => {
    const fetchPunicoes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}estatistica/jogador/punidos/`);
        const data = await response.json();

        const detalhesJogosPromises = data.data.map(async (item) => {
          if (item.punicao > 0) {
            const jogoId = item.jogoId;
            const responseJogo = await fetch(`${process.env.REACT_APP_API_URL}jogos/${jogoId}`);
            const dataJogo = await responseJogo.json();

            return {
              ...item,
              campeonatoName: dataJogo.data[0]?.campeonatoName,
              userCasaName: dataJogo.data[0]?.userCasaName,
              userForaName: dataJogo.data[0]?.userForaName,
              data: dataJogo.data[0]?.data,
            };
          }
          return null; 
        });

        const detalhesJogos = await Promise.all(detalhesJogosPromises);
        const filteredDetalhesJogos = detalhesJogos.filter(item => item !== null); 
        setPunicoes(filteredDetalhesJogos);
      } catch (error) {
        console.error("Erro ao buscar informações:", error);
      }
    };

    fetchPunicoes();
  }, []);


  console.log('Punicoes: ', punicoes)
  
  const ControleGrid = [
    {
      field: 'jogadorName',
      headerText: 'Atleta',
      width: '200',
      textAlign: 'Center',
    },
    {
      field: 'teamName', 
      headerText: 'Time',
      width: '200',
      textAlign: 'Center',
    },
    {
      field: 'punicao',
      headerText: 'Punição',
      width: '200',
      textAlign: 'Center',
      template: (data) => (<a>{data.punicao} Jogos</a>)
    },
    {
      field: 'campeonatoName', 
      headerText: 'Campeonato',
      width: '150',
      textAlign: 'Center',
    },
    {
        field: 'userForaName', 
        headerText: 'Jogo',
        width: '150',
        textAlign: 'Center',
        template: (data) => {
          if (data.userForaName === data.teamName) {
            return (<a>X {data.userCasaName}</a>);
          } else {
            return (<a>X {data.userForaName}</a>);
          }
        }
      },     
    {
      field: 'data', 
      headerText: 'Data do Jogo',
      width: '150',
      textAlign: 'Center',
      template: (data) => (<a>{data.data}</a>)
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
          className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'}`}
        >
          <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
            <Navbar />
          </div>
          {themeSettings && <ThemeSettings />}
          <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category="Equipe" title="Punições"/>
            <GridComponent
              dataSource={punicoes}
              allowPaging
              allowSorting
              toolbar={['Search']}
              width='auto'
            >
              <ColumnsDirective>
                {ControleGrid.map((item, index) => (
                  <ColumnDirective key={index} {...item} />
                ))}
              </ColumnsDirective>
              <Inject services={[Page, Search, Toolbar]} />
            </GridComponent> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default Punicoes;
