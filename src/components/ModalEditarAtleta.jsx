import React, { useState, useEffect } from 'react';
import { ModalAtletaFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const fields = ModalAtletaFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalEditarAtleta = ({ isVisible, onClose, currentColor, teamId, atletaId, atletaNome }) => {
  if (!isVisible) return null;

  const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialData, setInitialData] = useState([]);
  const [permissao, setPermissao] = useState(localStorage.getItem('permissao'));
  const navigate = useNavigate();

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  useEffect(() => {
    // Função para verificar a permissão
    const verificarPermissao = () => {
      const permissaoAtual = localStorage.getItem('permissao');
      if (permissao !== permissaoAtual) {
        setPermissao(permissaoAtual);
      }
    };

    // Configurando o intervalo para verificar a permissão a cada 1 segundo
    const intervalId = setInterval(verificarPermissao, 1000);

    // Limpando o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, [permissao]);

  console.log('Permissao: ', permissao)

  const handleChange = (e) => setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}elenco/${atletaId}`);
        const data = await response.json();
        if (data.status === 200 && data.data[0]) {
          setInitialData(data.data[0]);
        } else {
          toast.error('Failed to fetch groups');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('An error occurred while fetching groups');
      }
    };
    fetchInitialData();
  }, [atletaId]);

  console.log('initial: ', initialData)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = atletaId; 
    if (userId) {
      await enviarImagem();
    }
  };

  const enviarImagem = async () => {
    const userId = atletaId;
    if (!userId) {
      console.error('UserID não encontrado.');
      return;
    }

    const uploadTasks = ['RGFrente', 'RGVerso', 'fotoAtleta'].map(async (field) => {
      const fileField = document.querySelector(`input[id='${field}']`);
      if (fileField && fileField.files[0]) {
        return uploadImage(userId, fileField.files[0], field);
      }
    });

    await Promise.all(uploadTasks);
    editarAtleta();
  };

  const uploadImage = async (userId, file, imageField) => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('userType', 'elenco');
    formData.append('imageField', imageField);
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}image/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success(`${imageField} enviada com sucesso!`);
      } else {
        const data = await response.json();
        throw new Error(data.msg || `Erro ao enviar ${imageField}.`);
      }
    } catch (error) {
      console.error(`Erro ao enviar ${imageField}:`, error);
      toast.error(`Erro ao enviar ${imageField}.`);
    }
  };

  const editarAtleta = async () => {
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
        const response = await fetch(`${process.env.REACT_APP_API_URL}elenco/${atletaId}`, {
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
    window.location.reload();
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
      <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
        <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
          X
        </button>
        <div className='bg-white p-2 rounded' style={{ maxHeight: '100%', overflowY: 'auto' }}>
          <HeaderModal title={`Edite o Atleta ${atletaNome}`} />
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
              {fields.map((field, index) => {
                if (permissao === 'TEquipe' && (field.id === 'name' || field.id === 'documentNumber')) {
                  return null;
                }
                return (
                  <div key={field.id} className={`field-margin ${index !== 0 ? 'mt-2' : ''}`}>
                    {field.type === 'file' && (
                      <div className="text-sm mt-3 ml-2">
                        {field.placeholder}
                      </div>
                    )}
                    {field.type === 'dropdown' ? (
                      <select
                        id={field.id}
                        name={field.name}
                        value={modalFieldsState[field.id]}
                        onChange={handleChange}
                        className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                      >
                        <option value='' disabled>
                          Selecione a Categoria
                        </option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
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
                    )}
                  </div>
                );
              })}
              <FormAction currentColor={currentColor} text='Editar' />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarAtleta;
