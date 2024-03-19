import React, { useState, useEffect } from 'react';
import { ModalGrupoFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const fields = ModalGrupoFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalTimeGrupo = ({ isVisible, onClose, currentColor, campeonatoId, grupoId }) => {
  if (!isVisible) return null;

  const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [grupo, setGrupo] = useState([]);
  const navigate = useNavigate();
  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });

  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        const response = await fetch(` http://0.tcp.sa.ngrok.io:12599/inscricoes/campeonato/${campeonatoId}`);
        const result = await response.json();
        console.log('result', result);
  
        if (response.ok && result.data && Array.isArray(result.data)) {
          const teamNamesPromises = result.data.map(async (item) => {
            const userResponse = await fetch(` http://0.tcp.sa.ngrok.io:12599/users/${item.userId}`);
            const userData = await userResponse.json();
            console.log('Times: ', userData)
            if (userResponse.ok) {
              return { value: item.userId, label: `${userData.data.teamName}` };
            } else {
              throw new Error(`Failed to fetch team name for user ID: ${item.userId}`);
            }
          });
  
          // Resolve all promises to get team names
          const options = await Promise.all(teamNamesPromises);
          setUserOptions(options);
        } else {
          throw new Error('Failed to fetch user IDs');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Erro ao carregar IDs de usuário');
      }
    };
  
    fetchUserIds();
  }, [campeonatoId]);
  

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(` http://0.tcp.sa.ngrok.io:12599/grupos/${grupoId}`);
        const data = await response.json();
        setGrupo(data.data)
        
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Erro ao carregar Grupos');
      }
    };
  
    fetchGroup();
  }, []);

  const handleSubmit= async (e)=>{
    e.preventDefault();
    adcTimeGrupo();
  }

  const adcTimeGrupo = async () => {
    const payload = {
      userId: modalFieldsState.userId,
      grupoId,
    }
    try {
      const response = await fetch(' http://0.tcp.sa.ngrok.io:12599/grupos/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.status === 200) {
        toast.success(`Equipe Cadastrada ao  com sucesso ao ${grupo.name}!`, {
          position: "top-center",
          autoClose: 5000,
          onClose: () => navigate(`/campeonatos/${campeonatoId}`) 
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
          <HeaderModal title={`Cadastre nova Equipe ao ${grupo.name}`} heading='Preencha todos os dados' />
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
            <div className='-space-y-px'>
            {userOptions.length > 0 && (
                <div className="mt-4">
                    <label htmlFor="Clubes" className="block text-sm font-medium text-gray-700">Clubes</label>
                    <select
                    id="userId"
                    name="userId"
                    value={modalFieldsState.userId || ''}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    >
                    <option value="">Selecione a Equipe</option>
                    {userOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                        {option.label}
                        </option>
                    ))}
                    </select>
                </div>
                )}
              <FormAction currentColor={currentColor} text='Cadastrar' />
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalTimeGrupo;