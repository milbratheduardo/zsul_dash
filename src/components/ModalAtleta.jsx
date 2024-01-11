import React, { useState } from 'react';
import { ModalAtletaFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const fields = ModalAtletaFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalAtleta = ({ isVisible, onClose, currentColor, teamId }) => {
  if (!isVisible) return null;

  const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });

  const handleSubmit=(e)=>{
    e.preventDefault();
    adcAtleta()
  }

  const adcAtleta = async () => {
    const payload = {
      ...modalFieldsState,
      teamId,
    }
    try {
      const response = await fetch('http://localhost:3000/elenco/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.status === 200) {
        toast.success('Atleta Cadastrado com sucesso!', {
          position: "top-center",
          autoClose: 5000,
          onClose: () => navigate('/elenco') 
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
                      />
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