import React, {useEffect, useState,  useRef } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Inject } from '@syncfusion/ej2-react-grids';
import { Header, Button, Sidebar, Navbar, ThemeSettings, ModalGrupo, ModalTimeGrupo, 
  ModalAdicionarJogo, CardJogos, ModalEditarCampeonato } from '../components';
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
  const [gruposComTimes, setGruposComTimes] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const teamId = user.data.id;
  const [errorMessage, setErrorMessage] = useState("");
  const [campeonato, setCampeonato] = useState([]);
  const [showModalGrupo, setShowModalGrupo] = useState(false);
  const [showModalTimeGrupo, setShowModalTimeGrupo] = useState(false);
  const [showModalAdicionarJogo, setShowModalAdicionarJogo] = useState(false);
  const [showModalEditarCampeonato, setShowModalEditarCampeonato] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [jogos, setJogos] = useState([]);
  const [estatisticas, setEstatisticas] = useState([]);
  const permissao = localStorage.getItem('permissao') || '';
  const navigate = useNavigate();
  const endColor = chroma(currentColor).darken(1).css();
  const endColor2 = chroma(currentColor).darken(2).css();
  const swiperRef = useRef(null);
  

  

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
    ...(permissao !== 'TEquipe' ? [{
      headerText: 'Deletar',
      template: ({ teamId }) => <ActionButtonTemplate teamId={teamId} />,
      textAlign: 'Center',
      width: '120'
    }] : [])
  ];

  const goToNextGroup = () => {
    console.log('Checking swiperRef:', swiperRef.current);
    if (swiperRef.current?.swiper) {
      const swiper = swiperRef.current.swiper;
      const nextSlideIndex = (swiper.activeIndex + 1) % swiper.slides.length;
      swiper.slideTo(nextSlideIndex);
    } else {
      console.log('Swiper not initialized');
    }
  };
  

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(` ${process.env.REACT_APP_API_URL}grupos/campeonato/${id}`);
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
        // Fetch teams for the selected group
        const response = await fetch(`${process.env.REACT_APP_API_URL}grupos/team/grupo/${selectedGroupId}`);
        const data = await response.json();
        console.log('TIMES GRUPO: ', data.data);
  
        if (data.status !== 200 || !data.data) {
          toast.error('Failed to fetch teams for the group');
          return;
        }
  
        // Extract groupId and teamIds
        const groupId = selectedGroupId;
        const teamIds = data.data.map((team) => ({
          teamId: team.teamId,
          teamName: team.teamName,
        }));
  
        // Fetch all games (including inter-group games)
        const gamesResponse = await fetch(`${process.env.REACT_APP_API_URL}jogos/campeonato/${id}`);
        const gamesData = await gamesResponse.json();
        console.log('ALL GAMES: ', gamesData.data);
  
        if (gamesData.status !== 200 || !gamesData.data) {
          toast.error('Failed to fetch games for the championship');
          return;
        }
  
        // Fetch statistics for each game
        const gameStats = {};
        for (const game of gamesData.data) {
          const statsResponse = await fetch(`${process.env.REACT_APP_API_URL}estatistica/jogo/${game._id}`);
          const statsData = await statsResponse.json();
  
          if (statsData.status === 200 && statsData.data) {
            gameStats[game._id] = statsData.data[0];
          }
        }
        console.log('GAME STATISTICS: ', gameStats);
  
        // Calculate team statistics considering only games with the current groupId
        const teamStats = teamIds.map((team) => {
          const teamGames = gamesData.data.filter(
            (game) =>
              (game.userIdCasa === team.teamId || game.userIdFora === team.teamId) &&
              (game.grupoId === groupId || game.grupoId.includes(groupId)) // Include inter-group games
          );
  
          let vitorias = 0;
          let empates = 0;
          let derrotas = 0;
          let golsFeitos = 0;
          let golsSofridos = 0;
  
          for (const game of teamGames) {
            const stats = gameStats[game._id];
            if (stats) {
              const isHome = game.userIdCasa === team.teamId;
              const isAway = game.userIdFora === team.teamId;
  
              // Goals
              golsFeitos += isHome ? parseInt(stats.userCasaGols) : parseInt(stats.userForaGols);
              golsSofridos += isHome ? parseInt(stats.userForaGols) : parseInt(stats.userCasaGols);
  
              // Results
              if (stats.vencedor === team.teamId) {
                vitorias++;
              } else if (stats.vencedor === 'empate') {
                empates++;
              } else {
                derrotas++;
              }
            }
          }
  
          const pontos = vitorias * 3 + empates;
          const saldoGols = golsFeitos - golsSofridos;
  
          return {
            teamId: team.teamId,
            teamName: team.teamName,
            numeroJogos: teamGames.length,
            vitorias,
            empates,
            derrotas,
            golsFeitos,
            golsSofridos,
            saldoGols,
            pontos,
          };
        });
  
        // Sort teams
        teamStats.sort((a, b) => {
          if (b.pontos !== a.pontos) return b.pontos - a.pontos;
          if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols;
          return b.golsFeitos - a.golsFeitos;
        });
  
        // Add position
        const rankedTeams = teamStats.map((team, index) => ({
          ...team,
          P: index + 1,
        }));
  
        setTimeGroups(rankedTeams);
        console.log('RANKED TEAMS: ', rankedTeams);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('An error occurred while fetching statistics');
      }
    };
  
    fetchTimeGroupsAndStats();
  }, [selectedGroupId]);
  
  
  
  
  
    
  console.log('Time Groups: ', timeGroups)

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
      const groupResponse = await fetch(`${process.env.REACT_APP_API_URL}grupos/team/${teamIdFetch}`);
      const groupData = await groupResponse.json();
      console.log('teamID: ', groupData);
  
      if (groupData.status === 200 && groupData.data) {
        console.log("Group data fetched successfully:", groupData.data);
        const grupoId = groupData.data[0].grupoId;
  
        const payload = {
          teamId: teamIdFetch,
          grupoId: grupoId,
        };
  
        console.log("Payload for deletion:", payload);
  
        const deleteResponse = await fetch(`${process.env.REACT_APP_API_URL}grupos/grupo`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
  
        const deleteData = await deleteResponse.json();
        if (deleteData.status === 200) {
          const inscricaoResponse = await fetch(`${process.env.REACT_APP_API_URL}inscricoes/campeonato/${id}`);
          const inscricaoData = await inscricaoResponse.json();
  
          const inscricao = inscricaoData.data.find(inscricao => inscricao.userId === teamIdFetch);
  
          if (inscricao) {
            const deleteInscricaoResponse = await fetch(`${process.env.REACT_APP_API_URL}inscricoes/${inscricao._id}`, {
              method: 'DELETE'
            });
  
            if (deleteInscricaoResponse.ok) {
              toast.success('Equipe Deletada com sucesso!', {
                position: "top-center",
                autoClose: 5000,
                onClose: (() => navigate(`/campeonatos/${id}`),
                window.location.reload()) 
              });
              
            } else {
              console.error('Erro ao deletar inscrição.');
              toast.error('Erro ao deletar inscrição.');
            }
          } else {
            console.error('Inscrição não encontrada para a equipe com ID:', teamIdFetch);
            toast.error('Inscrição não encontrada');
          }
        } else {
          console.error('Erro ao deletar do grupo:', deleteData.msg);
          toast.error(deleteData.msg);
        }
      } else {
        console.error('Failed to fetch group data:', groupData.msg);
        toast.error('Failed to fetch group data');
      }
    } catch (error) {
      console.error('Erro ao processar a requisição:', error);
      toast.error('Ocorreu um erro ao processar sua requisição');
    }
  };
  
  

  const deletarCampeonato = async () => {
    try {
      const response = await fetch(` ${process.env.REACT_APP_API_URL}campeonatos/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.status === 200) {
        toast.success('Campeonato Deletado com sucesso!', {
          position: "top-center",
          autoClose: 5000,
          onClose: (() => navigate('/campeonatos')) 
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

  const deletarGrupo = async (groupId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}grupos/${groupId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (response.ok) {
        toast.success('Grupo Deletado com sucesso!', {
          position: "top-center",
          autoClose: 5000,
          onClose: () => {
            navigate(`/campeonatos/${id}`); 
            window.location.reload();
          } 
        });
      } else {
        console.error('Error:', data.msg);
        setErrorMessage(data.msg || "Erro desconhecido.");
      }
  
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setErrorMessage("Houve um problema ao conectar com o servidor.");
    }
  };
   

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const response = await fetch(` ${process.env.REACT_APP_API_URL}jogos/campeonato/${id}`);
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
        const response = await fetch(` ${process.env.REACT_APP_API_URL}campeonatos/${id}`);
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
            grupoId =''
            campeonatoId = {id} 
            onClose={() => {
              setShowModalAdicionarJogo(false);
              setSelectedGroupId('');
          }}/>

          <ModalEditarCampeonato
            isVisible={showModalEditarCampeonato} 
            currentColor={currentColor} 
            campeonatoId = {id} 
            onClose={() => {
              setShowModalEditarCampeonato(false);
            }}/>

          {!showModalGrupo && !showModalTimeGrupo && !showModalAdicionarJogo && !showModalEditarCampeonato && (
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
                {permissao !== 'TEquipe' && (
                  <>
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
                      bgColor={endColor2}
                      text='Editar Campeonato'
                      borderRadius='10px'
                      size='sm'
                      onClick={() => {
                        setShowModalEditarCampeonato(true);
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
                  </>
                )}
              </div>
              </div>
              <div>        
              <Swiper style={{ zIndex: 0}}
                  ref={swiperRef}
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
                        
                        {permissao === 'admin' && (
                          <>

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
                          <Button 
                            color='white'
                            bgColor='red'
                            text='Deletar Grupo'
                            borderRadius='10px'
                            size='sm'
                            onClick={() => {
                                deletarGrupo(group._id);
                            }}
                          />
                          
                          </>
                        )}
                        <Button 
                            color='white'
                            bgColor={endColor}
                            text='Próximo Grupo'
                            borderRadius='10px'
                            size='sm'
                            onClick={goToNextGroup}
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
                      local={jogo.campoId}
                      hora={jogo.hora}
                      currentColor={currentColor}
                      jogoId={jogo._id}
                      permissao = {permissao}
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
