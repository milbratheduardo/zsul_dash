import React, { useEffect, useState } from 'react';
import { Header, Navbar, Footer, Sidebar, ThemeSettings, ModalEditarPunicao, Button, ModalPunicao} from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Search, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

const Punicoes = () => {
  const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
  const [punicoes, setPunicoes] = useState([]);
  const [showEditarPunicao, setShowEditarPunicao] = useState(false);
  const [selectedAtleta, setSelectedAtleta] = useState(null);
  const [showModalPunicao, setShowModalPunicao] = useState(false);
  const permissao = localStorage.getItem('permissao') || '';

  useEffect(() => {
    const fetchPunicoes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}estatistica/jogador/punidos/`);
        const data = await response.json();

        const detalhesJogosPromises = data.data.map(async (item) => {
          if (item.numeroCartoesVermelho > 0) {
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
  
  const handleAtletaClick = (atleta) => {
    console.log('dados: ', atleta);
    setSelectedAtleta(atleta);
    setShowEditarPunicao(true);
  }
  const ControleGrid = [
    {
      field: 'jogadorName',
      headerText: 'Atleta',
      width: '200',
      textAlign: 'Center',
      template: (atleta) => ( 
        <a href="#" onClick={(e) => {
          e.preventDefault(); 
          if (permissao === 'admin') {
            handleAtletaClick(atleta); 
          } 
        }}>{atleta.jogadorName}</a>
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

          <ModalEditarPunicao
            isVisible={showEditarPunicao} 
            atleta={selectedAtleta}
            currentColor={currentColor}
            onClose={() => {
              setShowEditarPunicao(false);
            }} 
          />

          <ModalPunicao
            isVisible={showModalPunicao} 
            currentColor={currentColor}  
            onClose={() => {
              setShowModalPunicao(false);
          }}/>  

        {!showModalPunicao && !showEditarPunicao && (
          <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Header category="Equipe" title="Punições"/>
            {permissao !== 'TEquipe' && (
            <Button 
                  color='white'
                  bgColor={currentColor}
                  text='Adicionar Punição'
                  borderRadius='10px'
                  size='md'
                  onClick={() => {
                    setShowModalPunicao(true);
                  }}
                />
            )}
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
        )}  
        </div>
      </div>
    </div>
  );
}

export default Punicoes;
