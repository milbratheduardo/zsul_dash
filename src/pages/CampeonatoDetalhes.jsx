import React, {useEffect, useState} from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Inject } from '@syncfusion/ej2-react-grids';
import { Header, Button, Sidebar, Navbar, ThemeSettings, ModalGrupo, ModalTimeGrupo, 
  ModalAdicionarJogo, CardJogos } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import chroma from 'chroma-js';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';


const CampeonatoDetalhes = () => {
  const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
  const { id } = useParams();
  const [groups, setGroups] = useState([]);
  const [groupsTime, setGroupsTime] = useState([]);
  const [timeGroups, setTimeGroups] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const teamId = user.data.id;
  const [errorMessage, setErrorMessage] = useState("");
  const [campeonato, setCampeonato] = useState([]);
  const [showModalGrupo, setShowModalGrupo] = useState(false);
  const [showModalTimeGrupo, setShowModalTimeGrupo] = useState(false);
  const [showModalAdicionarJogo, setShowModalAdicionarJogo] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [jogos, setJogos] = useState([]);
  const [estatisticas, setEstatisticas] = useState([]);
  const permissao = localStorage.getItem('permissao') || '';
  const navigate = useNavigate();
  const endColor = chroma(currentColor).darken(1).css();

  

  const gridColumns = [
    { field: 'P', headerText: 'P', width: '25' },
    { field: 'teamName', headerText: 'Nome', width: '100' },
    { field: 'numeroJogos', headerText: 'J', width: '25' },
    { field: 'vitorias', headerText: 'V', width: '25' },
    { field: 'empates', headerText: 'E', width: '25' },
    { field: 'derrotas', headerText: 'D', width: '25' },
    { field: 'golsFeitos', headerText: 'GF', width: '25' },
    { field: 'saldoGols', headerText: 'SG', width: '25' },
    { field: 'pontos', headerText: 'Pts', width: '25' },
  
    {
      headerText: 'Deletar',
      template: ({ teamId }) => <ActionButtonTemplate teamId={teamId} />,
      textAlign: 'Center',
      width: '120'
    }
    
  ];

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`http://localhost:3000/grupos/campeonato/${id}`);
        const data = await response.json();
        if (data.status === 200 && data.data) {
          setGroups(data.data);
          setSelectedGroupId(data.data[0]?._id);
        } else {
          toast.error('Failed to fetch groups');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('An error occurred while fetching groups');
      }
    };

    fetchGroups();
  }, [id]);

  useEffect(() => {
    const fetchTimeGroupsAndStats = async () => {
      if (!selectedGroupId) return;
      try {
        const response = await fetch(`http://localhost:3000/grupos/team/grupo/${selectedGroupId}`);
        const data = await response.json();
        if (data.status === 200 && data.data) {
          const statsPromises = data.data.map(async (team) => {
            const teamStatsResponse = await fetch(`http://localhost:3000/users/${team.teamId}`);
            const teamStatsData = await teamStatsResponse.json();
            if (teamStatsData.status === 200 && teamStatsData.data) {
              return {
                ...team,
                numeroJogos: teamStatsData.data.numeroJogos || 0,
                vitorias: teamStatsData.data.vitorias || 0,
                empates: teamStatsData.data.empates || 0,
                derrotas: teamStatsData.data.derrotas || 0,
                golsFeitos: teamStatsData.data.golsFeitos || 0,
                saldoGols: teamStatsData.data.saldoGols || 0,
                pontos: teamStatsData.data.pontos || 0,
              };
            } else {
              return team;
            }
          });
  
          let teamsWithStats = await Promise.all(statsPromises);          
          teamsWithStats.sort((a, b) => b.pontos - a.pontos);
          teamsWithStats = teamsWithStats.map((team, index) => ({ ...team, P: index + 1 }));
          setTimeGroups(teamsWithStats);
        } else {
          toast.error('Failed to fetch groups');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('An error occurred while fetching groups');
      }
    };
  
    fetchTimeGroupsAndStats();
  }, [selectedGroupId]);
  
  

  const inscreverTime = async () => {
    const payload = {
      userId: teamId, 
      campeonatoId: id 
    };
  
    try {
      const response = await fetch('http://localhost:3000/inscricoes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.status === 200) {
        toast.success('Equipe Inscrita com sucesso!', {
          position: "top-center",
          autoClose: 5000,
          onClose: () => navigate('/sumulas') 
        });
      } else if (data.status === 400 || data.status === 500) {
        setErrorMessage(data.msg); 
      } else {
        console.log('Error:', data.msg);
      }
  
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setErrorMessage("Houve um problema ao conectar com o servidor.");
    }
  }  
  

  const ActionButtonTemplate = (teamId) => (
    <Button
      color='white'
      bgColor='red'
      text='Deletar Equipe'
      borderRadius='10px'
      size='sm'
      onClick={() => deletarTimeGrupo(teamId)}
      >
    </Button>
  );
  
  const deletarTimeGrupo = async (teamId) => {
    try {
      const teamIdFetch = teamId.teamId;
      const groupResponse =  await fetch(`http://localhost:3000/grupos/team/${teamIdFetch}`);
      const groupData = await groupResponse.json();
      console.log('teamID: ', groupData)
      
      if (groupData.status === 200 && groupData.data) {
        console.log("Group data fetched successfully:", groupData.data);
        const grupoId = groupData.data[0].grupoId; 
  
        
        const payload = {
          teamId: teamIdFetch, 
          grupoId: grupoId, 
        };
  
        console.log("Payload for deletion:", payload);
  
       
        const deleteResponse = await fetch(`http://localhost:3000/grupos/grupo`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
  
        const deleteData = await deleteResponse.json();
        if (deleteData.status === 200) {
          toast.success('Equipe Deletada com sucesso!', {
            position: "top-center",
            autoClose: 5000,
            onClose: () => navigate(`/campeonatos/${id}`)
          });
        } else {
          
          console.error('Error during deletion:', deleteData.msg);
          setErrorMessage(deleteData.msg);
          toast.error(deleteData.msg);
        }
      } else {
        
        console.error('Failed to fetch group data:', groupData.msg);
        toast.error('Failed to fetch group data');
      }
    } catch (error) {
      console.error('Error fetching group data or deleting team:', error);
      toast.error('An error occurred while processing your request');
    }
  };
  

  const deletarCampeonato = async () => {
    try {
      const response = await fetch(`http://localhost:3000/campeonatos/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.status === 200) {
        toast.success('Campeonato Deletado com sucesso!', {
          position: "top-center",
          autoClose: 5000,
          onClose: () => navigate('/campeonatos') 
        });
      } else if (data.status === 400 || data.status === 500) {
        setErrorMessage(data.msg); 
      } else {
        console.log('Error:', data.msg);
      }
  
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setErrorMessage("Houve um problema ao conectar com o servidor.");
    }
  }  

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/jogos/campeonato/${id}`);
        const data = await response.json();
        console.log('Dados Jogos: ', data);
        setJogos(data.data); 
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    };

    fetchJogos();
  }, []);

 
     

  useEffect(() => {
    const fetchCampeonato = async () => {
      try {
        const response = await fetch(`http://localhost:3000/campeonatos/${id}`);
        const data = await response.json();
        console.log('Dados: ', data);
        setCampeonato(data.data); 
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    };

    fetchCampeonato();
  }, []);


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

          <ModalGrupo
            isVisible={showModalGrupo} 
            currentColor={currentColor} 
            campeonatoId = {id} 
            onClose={() => {
              setShowModalGrupo(false);
          }}/>

          <ModalTimeGrupo
            isVisible={showModalTimeGrupo} 
            currentColor={currentColor} 
            grupoId ={selectedGroupId}
            campeonatoId = {id} 
            onClose={() => {
              setShowModalTimeGrupo(false);
              setSelectedGroupId('');
          }}/>

          <ModalAdicionarJogo
            isVisible={showModalAdicionarJogo} 
            currentColor={currentColor} 
            grupoId ={selectedGroupId}
            campeonatoId = {id} 
            onClose={() => {
              setShowModalAdicionarJogo(false);
              setSelectedGroupId('');
          }}/>

          {!showModalGrupo && !showModalTimeGrupo && !showModalAdicionarJogo && (
          <div className='m-2 md:m-10 mt-16 p-2 md:p-10 bg-white rounded-3xl'>
            <div className='flex flex-wrap md:flex-nowrap justify-between items-center'>
                <Header category='Clube' title={campeonato.name} />
                {errorMessage && 
                  <div 
                    style={{
                      backgroundColor: 'red', 
                      color: 'white',         
                      padding: '10px',       
                      borderRadius: '5px',    
                      textAlign: 'center',    
                      marginBottom: '10px'    
                    }}
                  >
                    {errorMessage}
                  </div>
                }
                <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0'>
                      <Button 
                        color='white'
                        bgColor={currentColor}
                        text='Adicionar Grupo'
                        borderRadius='10px'
                        size='sm'
                        onClick={() => {
                            setShowModalGrupo(true);
                        }}
                    />
                    <Button 
                        color='white'
                        bgColor={endColor}
                        text='Adicionar Jogo'
                        borderRadius='10px'
                        size='sm'
                        onClick={() => {
                            setShowModalAdicionarJogo(true);
                        }}
                    />
                    
                    <Button 
                        color='white'
                        bgColor='red'
                        text='Deletar Campeonato'
                        borderRadius='10px'
                        size='sm'
                        onClick={() => {
                            deletarCampeonato();
                        }}
                    />
                  {
                    /*permissao !== 'TEquipe'*/
                      <Button 
                          color='white'
                          bgColor='green'
                          text='Inscrever-se'
                          borderRadius='10px'
                          size='sm'
                          onClick={() => {
                              inscreverTime();
                          }}
                      />
                  }
                </div>
              </div>
              <div>        
                <Swiper
                  spaceBetween={25}
                  slidesPerView={1}
                  onSlideChange={(swiper) => {
                    const currentGroup = groups[swiper.activeIndex];
                    if (currentGroup) {
                      setSelectedGroupId(currentGroup._id);
                    }
                  }}
                  onSwiper={(swiper) => console.log(swiper)}
                >
                  {groups.map((group, index) => (
                    <SwiperSlide key={index}>                      
                        <h2 style={{textAlign:'center', marginBottom:'10px', marginTop:'10px', fontWeight:'bold'}}>{group.name}</h2>
                        <div>
                        <GridComponent dataSource={timeGroups}>
                          <ColumnsDirective>
                            {gridColumns.map((col, idx) => (
                              <ColumnDirective key={idx} {...col} />
                            ))}
                          </ColumnsDirective>
                          <Inject services={[Page]} />
                        </GridComponent>
                        </div>
                        <div style={{marginTop:'10px',marginBottom:'10px'}}>
                        <Button 
                            color={currentColor}
                            bgColor='white'
                            text='Cadastrar Equipe neste Grupo'
                            borderRadius='10px'
                            size='sm'
                            onClick={() => {
                                setSelectedGroupId(group._id);
                                setShowModalTimeGrupo(true);
                            }}
                        />
                        </div>                      
                    </SwiperSlide>
                  ))}
                </Swiper>
            </div>
            <div style={{textAlign:'center', marginTop:'30px', fontWeight:'bold', fontSize:'26px'}}>
              <h1>Jogos do {campeonato.name}</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {jogos.map((jogo) => (
                    <CardJogos
                      key={jogo._id} 
                      campeonatoId={jogo.campeonatoId} 
                      userIdCasa={jogo.userIdCasa}
                      userIdFora={jogo.userIdFora}
                      tipo={jogo.tipo}
                      grupoId={jogo.grupoId}
                      data={jogo.data}
                      local={jogo.local}
                      hora={jogo.hora}
                      currentColor={currentColor}
                      jogoId={jogo._id}
                    />
                  ))}
                </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampeonatoDetalhes;
