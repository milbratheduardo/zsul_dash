import React, { useEffect, useState } from 'react';
import { Header, Navbar, Footer, Sidebar, ThemeSettings, ModalEditarPunicao, Button, ModalPunicao, Navbar_lp, Sidebar_lp } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Search, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

const Punicoes_lp = () => {
  const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
  const [punicoes, setPunicoes] = useState([]);



  useEffect(() => {
    const fetchPunicoes = async () => {
      try {
        const jogadorResponse = await fetch(`${process.env.REACT_APP_API_URL}estatistica/jogador/punidos/`);
        const jogadorData = await jogadorResponse.json();
        console.log('DATA Jogador: ', jogadorData.data[0]);
  
        const staffResponse = await fetch(`${process.env.REACT_APP_API_URL}staff`);
        const staffData = await staffResponse.json();
        console.log('DATA Staff: ', staffData);
  
        const elencoPunicaoResponse = await fetch(`${process.env.REACT_APP_API_URL}elenco/punicao`);
        const elencoPunicaoData = await elencoPunicaoResponse.json();
        console.log('DATA Elenco Punição: ', elencoPunicaoData);
  
        const allJogadorData = jogadorData.data[0];
        const allStaffData = staffData.data.filter(item => item.punicao && item.punicao.length > 1);
        const allElencoPunicaoData = elencoPunicaoData.data;
  
        const staffWithTeamNamesPromises = allStaffData.map(async (staff) => {
          const teamResponse = await fetch(`${process.env.REACT_APP_API_URL}users/${staff.teamId}`);
          const teamData = await teamResponse.json();
          return {
            ...staff,
            teamName: teamData.data.teamName,
          };
        });
  
        const staffWithTeamNames = await Promise.all(staffWithTeamNamesPromises);
  
        // Corrigido o filtro
        const filteredJogadorData = allJogadorData.filter(item => 
          parseInt(item.numeroCartoesVermelho) > 0 || 
          (parseInt(item.numeroCartoesVermelho) === 0 && parseInt(item.punicao) > 0)
        );
  
        const detalhesJogosPromises = filteredJogadorData.map(async (item) => {
          if (parseInt(item.numeroCartoesVermelho) > 0) {
            const jogoId = item.jogoId;
            const responseJogo = await fetch(`${process.env.REACT_APP_API_URL}jogos/${jogoId}`);
            const dataJogo = await responseJogo.json();
        
            if (dataJogo.data && dataJogo.data.length > 0) {
              return {
                ...item,
                campeonatoName: dataJogo.data[0].campeonatoName,
                userCasaName: dataJogo.data[0].userCasaName,
                userForaName: dataJogo.data[0].userForaName,
                data: dataJogo.data[0].data,
              };
            } else {
              console.warn(`Nenhum dado encontrado para o jogo com ID: ${jogoId}`);
              return {
                ...item,
                campeonatoName: null,
                userCasaName: null,
                userForaName: null,
                data: null,
              };
            }
          }
          return item;
        });
  
        const detalhesJogos = await Promise.all(detalhesJogosPromises);
  
        const jogadorDataWithType = detalhesJogos.map(item => ({ ...item, tipo: 'Jogador' }));
        const staffDataWithType = staffWithTeamNames.map(item => ({ ...item, tipo: 'Staff' }));
        const elencoPunicaoDataWithType = allElencoPunicaoData.map(item => ({ ...item, tipo: 'Elenco' }));
  
        const combinedData = [...jogadorDataWithType, ...staffDataWithType, ...elencoPunicaoDataWithType];
  
        setPunicoes(combinedData);
      } catch (error) {
        console.error("Erro ao buscar informações:", error);
      }
    };
  
    fetchPunicoes();
  }, []);



  const ControleGrid = [
    {
      field: 'jogadorName',
      headerText: 'Nome',
      width: '200',
      textAlign: 'Center',
      template: (atleta) => (
        <a href="#" onClick={(e) => {
          e.preventDefault();
        }}>{atleta.jogadorName || atleta.name || atleta.elencoName}</a>
      )
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
      template: (data) => (<a>{data.punicao}</a>)
    },
    {
      field: 'campeonatoName',
      headerText: 'Campeonato',
      width: '300',
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
    },
    {
      field: 'tipo',
      headerText: 'Tipo',
      width: '150',
      textAlign: 'Center',
      template: (data) => (<a>{data.tipo === 'Elenco' ? 'Jogador' : data.tipo}</a>)
    }
  ];

  console.log('Punicoes: ', punicoes)
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
            <Sidebar_lp />
          </div>
        ) : (
          <div className='w-0 dark:bg-secondary-dark-bg'>
            <Sidebar_lp />
          </div>
        )}
        <div
          className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'}`}
        >
          <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
            <Navbar_lp />
          </div>
          {themeSettings && <ThemeSettings />}

            <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Header title="Punições" />
              </div>
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

export default Punicoes_lp;
