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
    campoId: '',
    grupoId: '',
};

fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalAdicionarJogo = ({ isVisible, onClose, currentColor, campeonatoId, grupoId }) => {
  if (!isVisible) return null;

  const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [campeonato, setCampeonato] = useState([]);
  const [campos, setCampos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const navigate = useNavigate();
  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });


  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const response = await fetch(` ${process.env.REACT_APP_API_URL}campeonatos/${campeonatoId}`);
        const data = await response.json();
        console.log('Dados: ', data);
        setCampeonato(data.data); 
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    };

    fetchCampeonatos();
  }, []);


  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        const response = await fetch(` ${process.env.REACT_APP_API_URL}inscricoes/campeonato/${campeonatoId}`);
        const result = await response.json();
        console.log('result', result);
  
        if (response.ok && result.data && Array.isArray(result.data)) {
          const teamNamesPromises = result.data.map(async (item) => {
            const userResponse = await fetch(` ${process.env.REACT_APP_API_URL}users/${item.userId}`);
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
    const fetchCampos = async () => {
      try {
        const response = await fetch(` ${process.env.REACT_APP_API_URL}campos`);
        const data = await response.json();
        console.log('Dados: ', data);
        setCampos(data.data); 
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    };

    fetchCampos();
  }, []);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await fetch(` ${process.env.REACT_APP_API_URL}grupos/campeonato/${campeonatoId}`);
        const data = await response.json();
        console.log('Dados: ', data);
        setGrupos(data.data); 
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    };

    fetchGrupos();
  }, []);

  

  const handleSubmit= async (e)=>{
    e.preventDefault();
    adcJogo();
  }

 
  const adcJogo = async () => {
    const payload = {
        userIdCasa: modalFieldsState.timeCasa,
        userIdFora: modalFieldsState.timeFora,
        tipo: modalFieldsState.tipo,
        data: modalFieldsState.data,
        hora: modalFieldsState.hora,
        campeonatoId: campeonatoId,
        grupoId: modalFieldsState.grupoId,
        campoId: modalFieldsState.campoId,
    }

    console.log('payload: ', payload)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}jogos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.status === 200) {
        toast.success(`Jogo Cadastrado ao  com sucesso ao ${campeonato.name}!`, {
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
          <HeaderModal title={`Cadastre novo Jogo do ${campeonato.name}`} heading='Preencha todos os dados' />
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
            <div className='space-y-4'>
              {userOptions.length > 0 && (
                <>
                  <select
                    id="timeCasa"
                    value={modalFieldsState.timeCasa}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione Time Casa</option>
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
                    required
                  >
                    <option value="">Selecione Time Fora</option>
                    {userOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </>
                )}
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
                                {field.placeholder}
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
                                placeholder={field.placeholder}
                                mask={field.mask}
                            />
                            </div>
                        )}
                        </div>
                    ))}
                  <div>
                    {grupos.length > 0 && (
                      <div className="mt-4">
                        <select
                          id="grupoId"
                          value={modalFieldsState.grupoId}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecione o Grupo da Partida</option>
                          {grupos.map((grupo) => (
                            <option key={grupo._id} value={grupo._id}>
                              {grupo.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {campos.length > 0 && (
                      <div className="mt-4">
                        <select
                          id="campoId"
                          value={modalFieldsState.campoId}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecione o Local da Partida</option>
                          {campos.map((campo) => (
                            <option key={campo._id} value={campo._id}>
                              {campo.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <FormAction currentColor={currentColor} text='Cadastrar' />
                  </div>
           </div> 
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalAdicionarJogo;