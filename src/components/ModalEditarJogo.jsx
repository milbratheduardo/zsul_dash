import React, { useState, useEffect } from 'react';
import { ModalAdicionarJogoFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const fields = ModalAdicionarJogoFields;
let fieldsState = {
    timeCasa: '',
    timeFora: '',
};

fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalEditarJogo = ({ isVisible, onClose, currentColor, campeonatoId, grupoId, 
  jogoId, timeCasa, timeFora }) => {
  if (!isVisible) return null;

  const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialData, setInitialData] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const navigate = useNavigate();
  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(` http://0.tcp.sa.ngrok.io:17723/jogos/${jogoId}`);
        const data = await response.json();
        if (data.status === 200 && data.data) {
          setInitialData(data.data);
        } else {
          toast.error('Failed to fetch groups');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('An error occurred while fetching groups');
      }
    };
    fetchInitialData();
  }, [jogoId]);

  console.log('initial: ', initialData)

  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        const response = await fetch(` http://0.tcp.sa.ngrok.io:17723/inscricoes/campeonato/${campeonatoId}`);
        const result = await response.json();
        console.log('result', result);
  
        if (response.ok && result.data && Array.isArray(result.data)) {
          const teamNamesPromises = result.data.map(async (item) => {
            const userResponse = await fetch(` http://0.tcp.sa.ngrok.io:17723/users/${item.userId}`);
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

  const handleSubmit= async (e)=>{
    e.preventDefault();
    editarJogo();
  }

 
  const editarJogo = async () => {
    const changes = Object.keys(modalFieldsState).reduce((acc, field) => {
      if (modalFieldsState[field] !== (initialData[field] || '')) {
        acc.push({ field, value: modalFieldsState[field] });
      }
      return acc;
    }, []);
  
    const changesAll = changes.filter(change => change.field !== "" && change.value !== "");
  
    if (changesAll.length === 0) {
      toast.info('Não houve mudanças!');
      return;
    }
  
    for (const change of changesAll) {
      try {
        const response = await fetch(` http://0.tcp.sa.ngrok.io:17723/jogos/${jogoId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(change)
        });
  
        const data = await response.json();
        if (response.ok) {
          toast.success(`Campo ${change.field} editado com sucesso!`, {
            position: "top-center",
            autoClose: 5000
          });
        } else {
          console.error('Error:', data.msg);
          toast.error(data.msg || 'Erro desconhecido.');
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        toast.error("Houve um problema ao conectar com o servidor.");
      }
    }
  
    navigate(`/campeonatos/${campeonatoId}`);
  };
  
  
  

  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
      <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
        <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
          X
        </button>
        <div className='bg-white p-2 rounded' style={{maxHeight: '100%', overflowY: 'auto'}}>
          <HeaderModal title={`Edite Jogo Entre ${timeCasa} e ${timeFora}`} heading='Preencha todos os dados' />
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
                <div className="mt-4">
                      <select
                        id="timeCasa"
                        value={modalFieldsState.timeCasa}
                        onChange={handleChange}
                        >
                        <option value="">{timeCasa}</option>
                        {userOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                            {option.label}
                            </option>
                        ))}
                      </select>

                      <select
                        id="timeFora"
                        value={modalFieldsState.timeFora}
                        onChange={handleChange}
                        >
                        <option value="">{timeFora}</option>
                        {userOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                            {option.label}
                            </option>
                        ))}
                      </select>
                    {fields.map((field, index) => (
                        <div key={field.id} className={`field-margin ${index !== 0 ? 'mt-2' : ''} ${field.type === 'dropdown' ? 'mb-2' : ''}`}>
                        {field.type === 'dropdown' ? (
                            <div>
                            <select
                                id={field.id}
                                name={field.name}
                                value={modalFieldsState[field.id]}
                                onChange={handleChange}
                                className='mt-3 p-2 block w-full border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                            >
                                <option value='' disabled>
                                {initialData[field.id] ? initialData[field.id] : field.placeholder}
                                </option>
                                {field.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                                ))}
                            </select>
                            </div>
                        ) : (
                            <div>
                            {field.type === 'file' ? (
                                <label className='block text-sm font-medium text-gray-700 mt-4 ml-3'>{field.labelText}</label>
                            ) : null}
                            <Input
                                handleChange={handleChange}
                                value={modalFieldsState[field.id]}
                                labelText={field.labelText}
                                labelFor={field.labelFor}
                                id={field.id}
                                name={field.name}
                                type={field.type}
                                isRequired={field.isRequired}
                                placeholder={initialData[field.id] ? initialData[field.id] : field.placeholder}
                                mask={field.mask}
                            />
                            </div>
                        )}
                        </div>
                    ))}
                </div>
              <FormAction currentColor={currentColor} text='Editar' />
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarJogo;