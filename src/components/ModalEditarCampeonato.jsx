import React, { useState, useEffect } from 'react';
import { ModalCompeticaoFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';


const fields = ModalCompeticaoFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalEditarCampeonato = ({ isVisible, onClose, currentColor, campeonatoId }) => {
  if (!isVisible) return null;

  const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState([]);

  const handleClose = (e) => {
      if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(` ${process.env.REACT_APP_API_URL}campeonatos/${campeonatoId}`);
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
  }, [campeonatoId]);

  console.log('initial: ', initialData)


  const handleSubmit= async (e)=>{
    e.preventDefault();
    editarCampeonato();
  }

 
  const editarCampeonato = async () => {
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}campeonatos/${campeonatoId}`, {
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

    const fileField = document.querySelector("input[type='file']");
    if (fileField && fileField.files[0]) {
        await uploadImage(campeonatoId, fileField.files[0]);
    } else {
        navigate(`/campeonatos/${campeonatoId}`);
    }
};



  const uploadImage = async (championshipId, file) => {
    const formData = new FormData();
    formData.append('userId', championshipId);
    formData.append('userType', 'campeonato');
    formData.append('imageField', 'picture');
    formData.append('file', file);

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}image/`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            toast.success('Imagem atualizada com sucesso!', {
                position: "top-center",
                autoClose: 5000,
                onClose: () => navigate(`/campeonatos/${championshipId}`)
            });
        } else {
            const data = await response.json();
            throw new Error(data.msg || 'Erro ao enviar imagem.');
        }
    } catch (error) {
        console.error('Erro ao enviar imagem:', error);
        toast.error('Erro ao enviar imagem.', {
            position: "top-center",
            autoClose: 5000,
        });
    }
};

  

  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
      <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
        <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
          X
        </button>
        <div className='bg-white p-2 rounded' style={{ maxHeight: '100%', overflowY: 'auto' }}>
          <HeaderModal title={`Edite o Campeonato ${initialData?.name}`} heading='Preencha todos os dados' />
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

export default ModalEditarCampeonato;