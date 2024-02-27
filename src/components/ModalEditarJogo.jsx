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

const ModalEditarJogo = ({ isVisible, onClose, currentColor, jogoId, 
    grupoId, campeonatoId, }) => {
  if (!isVisible) return null;

  const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
  const [initialState, setInitialState] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [campeonato, setCampeonato] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJogoData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/jogos/${jogoId}`);
        const data = await response.json();
        if (response.ok) {
          setModalFieldsState(data);
          setInitialState(data);
        } else {
          toast.error('Erro ao carregar dados do jogo.');
        }
      } catch (error) {
        console.error('Error fetching jogo data:', error);
        setErrorMessage("Houve um problema ao conectar com o servidor.");
      }
    };

    fetchJogoData();
  }, [jogoId]);

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const changedFields = Object.keys(modalFieldsState).reduce((acc, key) => {
      if (modalFieldsState[key] !== initialState[key]) {
        acc[key] = modalFieldsState[key];
      }
      return acc;
    }, {});

    if (Object.keys(changedFields).length > 0) {
      await editarJogo(changedFields);
    } else {
      toast.info('Nenhuma alteração detectada.');
    }
  };

  const editarJogo = async (changedFields) => {
    console.log('Changed fields for PATCH:', changedFields);
    try {
      const response = await fetch(`http://localhost:3000/jogos/${jogoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changedFields)
      });
      
      const data = await response.json();
      if (response.ok) {
        toast.success(`Jogo Editado com sucesso!`, {
          position: "top-center",
          autoClose: 5000,
          onClose: () => navigate(`/campeonatos/${campeonatoId}`) 
        });
      } else {
        setErrorMessage(data.msg);
      }
    } catch (error) {
      console.error('There was a problem with the PATCH operation:', error);
      setErrorMessage("Houve um problema ao conectar com o servidor.");
    }
  };

  console.log("Initial State: ", initialState)

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
            <div className='-space-y-px'>
            {userOptions.length > 0 && (
                <div className="mt-4">
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

export default ModalEditarJogo;