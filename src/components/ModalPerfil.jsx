import React, { useState } from 'react';
import { ModalPerfilFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

const fields = ModalPerfilFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalPerfil = ({ isVisible, onClose, currentColor, userId }) => {
  if (!isVisible) return null;

  const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });
  
  const compressImage = async (file) => {
    const options = {
        maxSizeMB: 0.015,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error(error);
        return file;
    }
};

const convertFileToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result.replace(/^data:.+;base64,/, ''));
    reader.readAsDataURL(file);
};

const handleSubmit = (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('logo');
    if (fileInput && fileInput.files[0]) {
        compressImage(fileInput.files[0]).then(compressedFile => {
            convertFileToBase64(compressedFile, (base64String) => {
                const jsonData = {
                    userId: userId,
                    file: base64String,
                    fileType: fileInput.files[0].type.split('/')[1],
                    userType: 'user',
                    imageField: 'picture',
                };

                editPerfil(jsonData);
            });
        });
    }
};

const editPerfil = async (jsonData) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}image/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        });

        const data = await response.json();

        if (response.ok) {
            toast.success('Perfil atualizado com sucesso!', {
                position: "top-center",
                autoClose: 5000,
                onClose: (() => navigate('/perfil'),
                window.location.reload())
            });
        } else {
            setErrorMessage(data.msg || 'Erro ao atualizar o perfil.');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setErrorMessage("Houve um problema ao conectar com o servidor.");
        toast.error('Erro ao atualizar o perfil.', {
            position: "top-center",
            autoClose: 5000,
        });
    }
};
  

  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50' id='wrapper' onClick={handleClose}>
      <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
        <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
          X
        </button>
        <div className='bg-white p-2 rounded' style={{maxHeight: '100%', overflowY: 'auto'}}>
          <HeaderModal title='Edite as Informações do Seu Perfil' heading='Preencha todos os dados' />
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
                        placeholder={field.placeholder}
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

export default ModalPerfil;