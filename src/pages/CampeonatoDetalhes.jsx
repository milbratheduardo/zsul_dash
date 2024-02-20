import React, {useEffect, useState} from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Inject } from '@syncfusion/ej2-react-grids';
import { Header, Button, Sidebar, Navbar, ThemeSettings, ModalGrupo, ModalTimeGrupo } from '../components';
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
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const teamId = user.data.id;
  const [errorMessage, setErrorMessage] = useState("");
  const [campeonato, setCampeonato] = useState([]);
  const [showModalGrupo, setShowModalGrupo] = useState(false);
  const [showModalTimeGrupo, setShowModalTimeGrupo] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');

  const navigate = useNavigate();
  const endColor = chroma(currentColor).darken(1).css();

  const gridColumns = [
    { field: 'P', headerText: 'P', width: '25' },
    { field: 'name', headerText: 'Nome', width: '100' },
    { field: 'J', headerText: 'J', width: '25' },
    { field: 'V', headerText: 'V', width: '25' },
    { field: 'E', headerText: 'E', width: '25' },
    { field: 'D', headerText: 'D', width: '25' },
    { field: 'GF', headerText: 'GF', width: '25' },
    { field: 'SG', headerText: 'SG', width: '25' },
    { field: 'Pts', headerText: 'Pts', width: '25' },
  ];

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`http://localhost:3000/grupos/campeonato/${id}`);
        const data = await response.json();
        if (data.status === 200 && data.data) {
          setGroups(data.data);
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

          {!showModalGrupo && !showModalTimeGrupo && (
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
                            adicionarJogo();
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
                </div>
              </div>
              <div>        
                <Swiper
                  spaceBetween={25}
                  slidesPerView={1}
                  onSlideChange={() => console.log('slide change')}
                  onSwiper={(swiper) => console.log(swiper)}
                >
                  {groups.map((group, index) => (
                    <SwiperSlide key={index}>                      
                        <h2 style={{textAlign:'center', marginBottom:'10px', fontWeight:'bold'}}>{group.name}</h2>
                        <div>
                        <GridComponent dataSource={group.teams}>
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
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampeonatoDetalhes;
