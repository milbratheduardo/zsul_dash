import React, { useState, useEffect } from 'react';
import HeaderModal from './HeaderModal';
import FormAction from './FormAction';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const ModalClubeOpcoes = ({ isVisible, onClose, clubeNome, teamId }) => {
    if (!isVisible) return null;
    const [imageSrc, setImageSrc] = useState('');
    const [userInfo, setUserInfo] = useState({});
    const [userAtletas, setUserAtletas] = useState([]);
    const [userStaff, setUserStaff] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const handleClose = (e) => {
        if (e.target.id === 'wrapper') onClose();
      };

    useEffect(() => {
       const imageData = {
         userId: teamId,
         userType: "user",
         imageField: "picture"
      };
    
       const apiUrl = `${process.env.REACT_APP_API_URL}image/blob`;
    
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(imageData)
        })
        .then(response => response.json())
        .then(data => {
          console.log('Resposta da API:', data);
          if (data.data !== '' && data.data !== null) {
            setImageSrc(data.data);
          }
        })
        .catch((error) => {
          console.error(`Fetch error: ${error}`);
        });
      }, []);  

      useEffect(() => {
        const fetchUserInfo = async () => {
          const userId = teamId;
          try {
            const response = await fetch(` ${process.env.REACT_APP_API_URL}users/${userId}`);
           
            if (response.ok) {
              const data = await response.json();
              setUserInfo(data);
              console.log('Dados: ', data);
            } else {
              console.error('Erro ao buscar dados do usuário');
            }
          } catch (error) {
            console.error('Erro na solicitação:', error);
          }
        };
    
        if (teamId) {
          fetchUserInfo();
        }
      }, [teamId]);

      useEffect(() => {
        const fetchUserAtletas = async () => {
          const userId = teamId;
          try {
            const responseAtletas = await fetch(` ${process.env.REACT_APP_API_URL}elenco/team/${userId}`);
    
            if (responseAtletas.ok) {
              const dataAtletas = await responseAtletas.json();
              setUserAtletas(dataAtletas);
              console.log('userAtletas: ', userAtletas);
            } else {
              console.error('Erro ao buscar atletas do usuário');
            }
          } catch (error) {
            console.error('Erro na solicitação:', error);
          }
        };
    
        if (teamId) {
          fetchUserAtletas();
        }
      }, [teamId]);
      


      useEffect(() => {
        const fetchUserStaff = async () => {
          const userId = teamId;
          try {
            const responseStaff = await fetch(` ${process.env.REACT_APP_API_URL}staff/team/${userId}`);
            console.log('Staff: ', responseStaff);
            if (responseStaff.ok) {
              const dataStaff = await responseStaff.json();
              
              setUserStaff(dataStaff);
            } else {
              console.error('Erro ao buscar staff do usuário');
            }
          } catch (error) {
            console.error('Erro na solicitação:', error);
          }
        };
    
        if (teamId) {
          fetchUserStaff();
        }
      }, [teamId]);


      const handleSubmit= async (e)=>{
        e.preventDefault();

        try{
          const response = await fetch(` ${process.env.REACT_APP_API_URL}users/${teamId}`, {
          method: 'DELETE',
        }); 

        const data = await response.json();
        if (data.status === 200) {
          toast.success('Equipe Deletada com Sucesso!', {
            position: "top-center",
            autoClose: 5000,
            onClose: () => navigate('/Clubes') 
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


    return (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
          <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
            <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
              X
            </button>
            <div className='bg-white p-2 rounded' style={{maxHeight: '100%', overflowY: 'auto'}}>
              <HeaderModal title={`Informações sobre ${clubeNome}`} heading='' />
              <form className='mt-4 space-y-4' onSubmit={handleSubmit}>    
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
              <div className="flex flex-col items-center justify-center gap-2">
                <img alt="Perfil" src={imageSrc}  className="h-20 w-20 rounded-full object-cover object-center"  />
                <h3 className="text-xl font-semibold leading-normal text-blueGray-700">
                  Email da Equipe
                </h3>
                <div className="text-blueGray-600">
                  {userInfo.data?.email || 'Carregando...'}
                </div>
                <div className='w-full' aria-hidden='true'></div>
                <h3 className="text-xl font-semibold leading-normal text-blueGray-700">
                  Cidade
                </h3>
                <div className="text-blueGray-600">
                  {userInfo.data?.city || 'Carregando...'}
                </div>
                <div className='w-full' aria-hidden='true'></div>
                <h3 className="text-xl font-semibold leading-normal text-blueGray-700">
                  Estado
                </h3>
                <div className="text-blueGray-600">
                  {userInfo.data?.state || 'Carregando...'}
                </div>
                <div className='w-full' aria-hidden='true'></div>
                <h3 className="text-xl font-semibold leading-normal text-blueGray-700">
                  Quantidade de Atletas
                </h3>
                <div className="text-blueGray-600">
                  {userAtletas.data?.length || 'Carregando...'}
                </div>
                <div className='w-full' aria-hidden='true'></div>
                <h3 className="text-xl font-semibold leading-normal text-blueGray-700">
                  Quantidade de Membros da Comissão Técnica
                </h3>
                <div className="text-blueGray-600">
                  {userStaff.data?.length || 'Carregando...'}
                </div>
                <FormAction currentColor='red' text='Deletar Equipe' />
              </div>    
                
              </form>
            </div>
          </div>
        </div>
      );
    };
    
export default ModalClubeOpcoes;