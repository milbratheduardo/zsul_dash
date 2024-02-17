import React, {useEffect, useState} from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Inject } from '@syncfusion/ej2-react-grids';
import { Header, Button, Sidebar, Navbar, ThemeSettings } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import chroma from 'chroma-js';


const CampeonatoDetalhes = () => {
  const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const teamId = user.data.id;
  const [errorMessage, setErrorMessage] = useState("");
  const [campeonato, setCampeonato] = useState([]);
  const navigate = useNavigate();
  const endColor = chroma(currentColor).darken(1).css();

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

  const adicionarGrupo = async () => {
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
                            adicionarGrupo();
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampeonatoDetalhes;
