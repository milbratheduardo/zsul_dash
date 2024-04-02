import React, { useState } from 'react';
import { ModalAtletaFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression'; // Certifique-se de instalar esta biblioteca

const fields = ModalAtletaFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalAtleta = ({ isVisible, onClose, currentColor, teamId }) => {
  if (!isVisible) return null;

  const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const data = Date() 
  const ano = data.split(" ")[3]

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      name: modalFieldsState['name'],
      dateOfBirth: modalFieldsState['dateOfBirth'],
      documentNumber: modalFieldsState['documentNumber'],
      school: modalFieldsState['school'],
      currentDate: ano
    };

    adcAtleta(requestData);
  };

  const adcAtleta = async (data) => {
    const payload = {
      ...data,
      teamId,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}elenco/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok && responseData.data._id) {
        const elencoId = responseData.data._id;
        handleImageUpload(elencoId); 
      } else {
        throw new Error(responseData.msg || 'Erro ao cadastrar atleta');
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setErrorMessage("Houve um problema ao conectar com o servidor.");
    }
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.02,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
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

  const handleImageUpload = async (elencoId) => {
    const imageFields = fields.filter(field => field.type === 'file');
    
    for (let field of imageFields) {
      const fileInput = document.getElementById(field.id);
      if (fileInput && fileInput.files[0]) {
        try {
          const compressedFile = await compressImage(fileInput.files[0]);
          convertFileToBase64(compressedFile, async (base64String) => {
            await uploadImage(elencoId, base64String, compressedFile.type.split('/')[1], field.id);
          });
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
    }
  };
  
  const uploadImage = async (elencoId, base64String, fileType, imageField) => {
    const jsonData = {
      userId: elencoId,
      file: base64String,
      fileType: fileType,
      userType: 'elenco',
      imageField: imageField 
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}image/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });
  
      if (response.ok) {
        toast.success(`${imageField} enviada com sucesso!`, {
          position: "top-center",
          autoClose: 5000,
          onClose: () => navigate('/elenco')
        });
      } else {
        const data = await response.json();
        throw new Error(data.msg || `Erro ao enviar ${imageField}.`);
      }
    } catch (error) {
      console.error(`Erro ao enviar ${imageField}:`, error);
      toast.error(`Erro ao enviar ${imageField}.`, {
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
        <div className='bg-white p-2 rounded' style={{maxHeight: '100%', overflowY: 'auto'}}>
          <HeaderModal title='Cadastre novo Atleta' heading='Preencha todos os dados' />
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
                          Selecione a Categoria
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
                      {field.id === 'documentNumber' && (
                        <div>
                          <p className="text-gray-600 text-xs" style={{marginTop: '-10px', marginLeft: '5px', fontSize: '10px'}}>
                          Caso o atleta NÃO possua RG, colocar CPF.
                        </p>
                        <p className="text-gray-600 text-xs" style={{marginTop: '-5px', marginLeft: '5px', fontSize: '10px'}}>
                          Caso o atleta NÃO possua RG NEM CPF, colocar Certidão de Nascimento.
                        </p>
                        </div>
                        
                      )}
                    </div>
                  )}
                </div>
              ))}
              <FormAction currentColor={currentColor} text='Cadastrar' />
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalAtleta;