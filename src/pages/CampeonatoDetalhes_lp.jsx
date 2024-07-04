import React, {useEffect, useState,  useRef } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Inject } from '@syncfusion/ej2-react-grids';
import { Header, Button, Sidebar, Navbar, ThemeSettings, ModalGrupo, ModalTimeGrupo, 
  ModalAdicionarJogo, CardJogos, ModalEditarCampeonato, 
  Sidebar_lp, CardJogos_lp,
  Navbar_lp} from '../components';
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
  const [errorMessage, setErrorMessage] = useState("");
  const [campeonato, setCampeonato] = useState([]);
  const [showModalGrupo, setShowModalGrupo] = useState(false);
  const [showModalTimeGrupo, setShowModalTimeGrupo] = useState(false);
  const [showModalAdicionarJogo, setShowModalAdicionarJogo] = useState(false);
  const [showModalEditarCampeonato, setShowModalEditarCampeonato] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [jogos, setJogos] = useState([]);
  const [estatisticas, setEstatisticas] = useState([]);
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
        const response = await fetch(`${process.env.REACT_APP_API_URL}grupos/team/grupo/${selectedGroupId}`);
        const data = await response.json();
        
  
        if (data.status === 200 && data.data) {
          const teamStatsResponse = await fetch(`${process.env.REACT_APP_API_URL}inscricoes/campeonato/${id}`);
          const teamStatsData = await teamStatsResponse.json();
          
  
          if (teamStatsData.status === 200 && teamStatsData.data) {
            const teamsWithStats = data.data.map((team) => {
              const teamStats = teamStatsData.data.find(stats => stats.userId === team.teamId) || {};
              return {
                ...team,
                numeroJogos: teamStats.numeroJogos || 0,
                vitorias: teamStats.vitorias || 0,
                empates: teamStats.empates || 0,
                derrotas: teamStats.derrotas || 0,
                golsFeitos: teamStats.golsFeitos || 0,
                saldoGols: teamStats.saldoGols || 0,
                pontos: teamStats.pontos || 0,
              };
            });
            teamsWithStats.sort((a, b) => {
              if (b.pontos !== a.pontos) return b.pontos - a.pontos;
              if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
              if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols;
              if (b.golsFeitos !== a.golsFeitos) return b.golsFeitos - a.golsFeitos;
              const golsSofridosA = a.golsFeitos - a.saldoGols;
              const golsSofridosB = b.golsFeitos - b.saldoGols;
              return golsSofridosA - golsSofridosB;
            });
  
            // Update team positions
            const rankedTeamsWithStats = teamsWithStats.map((team, index) => ({ ...team, P: index + 1 }));
            setTimeGroups(rankedTeamsWithStats);
          } else {
            console.error('Failed to fetch team stats, response:', teamStatsData);
            toast.error('Failed to fetch team stats');
          }
        } else {
          console.error('Failed to fetch groups, response:', data);
          toast.error('Failed to fetch groups');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('An error occurred while fetching groups');
      }
    };
  
    fetchTimeGroupsAndStats();
  }, [selectedGroupId]);
  
  
  
    
  console.log('Time Groups: ', timeGroups)  
   

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

          <div className='m-2 md:m-10 mt-16 p-2 md:p-10 bg-white rounded-3xl'>
            <div className='flex flex-wrap md:flex-nowrap justify-between items-center'>
                <Header title={campeonato.name} />
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
                    <CardJogos_lp
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
                    />
                  ))}
                </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampeonatoDetalhes;
