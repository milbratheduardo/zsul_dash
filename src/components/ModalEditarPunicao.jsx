import React, { useState, useEffect } from 'react';
import { ModalEditarPunicaoFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const fields = ModalEditarPunicaoFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalEditarPunicao = ({ isVisible, onClose, currentColor, atleta }) => {
  if (!isVisible) return null;

  const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialData, setInitialData] = useState([]);
  const [elencoPunicaoId, setElencoPunicaoId] = useState('');
  const navigate = useNavigate();

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        let response;
        if (atleta.tipo === 'Jogador') {
          response = await fetch(`${process.env.REACT_APP_API_URL}estatistica/jogador/${atleta.jogadorId}`);
        } else if (atleta.tipo === 'Elenco') {
          response = await fetch(`${process.env.REACT_APP_API_URL}elenco/punicao`);
        } else if (atleta.tipo === 'Staff') {
          response = await fetch(`${process.env.REACT_APP_API_URL}staff`);
        }

        const data = await response.json();
        if (response.ok && data.data) {
          if (atleta.tipo === 'Elenco') {
            const elencoPunicao = data.data.find(p => p.elencoId === atleta.elencoId && p.campeonatoId === atleta.campeonatoId);
            if (elencoPunicao) {
              setElencoPunicaoId(elencoPunicao._id);
              setInitialData(elencoPunicao);
            } else {
              toast.error('Punição não encontrada para o elenco.');
            }
          } else {
            setInitialData(data.data);
          }
        } else {
          toast.error('Erro ao buscar perfil');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('An error occurred while fetching user');
      }
    };
    fetchInitialData();
  }, [atleta._id, atleta.tipo, atleta.jogadorId, atleta.elencoId, atleta.campeonatoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    editPerfil();
  };

  const editPerfil = async () => {
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
        const requestBody = {
          field: change.field,
          value: change.value
        };

        let endpoint = '';
        let method = 'PATCH';

        if (atleta.tipo === 'Jogador') {
          endpoint = `${process.env.REACT_APP_API_URL}estatistica/jogador/${atleta._id}`;
        } else if (atleta.tipo === 'Elenco') {
          endpoint = `${process.env.REACT_APP_API_URL}elenco/punicao/${elencoPunicaoId}`;
        } else if (atleta.tipo === 'Staff') {
          endpoint = `${process.env.REACT_APP_API_URL}staff/${atleta._id}`;
        }

        const response = await fetch(endpoint, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        if (response.ok) {
          toast.success(`Campo ${change.field} editado com sucesso!`, {
            position: "top-center",
            autoClose: 5000,
            onClose: (() => {
              navigate('/punicoes');
              window.location.reload();
            })
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
  };


  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50' id='wrapper' onClick={handleClose}>
      <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
        <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
          X
        </button>
        <div className='bg-white p-2 rounded' style={{ maxHeight: '100%', overflowY: 'auto' }}>
          <HeaderModal title={atleta.tipo === 'Staff' ? 'Edite os Dias de Punição do Staff' : 'Edite os Dias de Punição do Atleta'} 
            heading={`${atleta.jogadorName || atleta.elencoName || atleta.name}`} />
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
              {fields.map((field, index) => (
                <div key={field.id} className={`field-margin ${index !== 0 ? 'mt-2' : ''} ${field.type === 'dropdown' ? 'mb-2' : ''}`}>
                  {field.type === 'dropdown' ? (
                    <div>
                      <select
                        id={field.id}
                        name={field.name}
                        value={modalFieldsState[field.id]}
                        onChange={handleChange}
                        className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                      >
                        <option value='' disabled>
                          Selecione o Cargo
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
                        placeholder={initialData[0]?.punicao || ''}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <FormAction currentColor={currentColor} text='Editar' />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarPunicao;
