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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userId = await adcAtleta(); 
    if (userId) {
   
      await enviarImagem('RGFrente');
      await enviarImagem('RGVerso');
      await enviarImagem('fotoAtleta');
  
   
      localStorage.removeItem('fotoAtleta');
    }
  }

  const enviarImagem = async (imageField) => {
    const userId = localStorage.getItem('fotoAtleta'); 
    if (!userId) {
      console.error('UserID não encontrado no localStorage.');
      return;
    }
  
    const file = document.getElementById(imageField).files[0];
    if (!file) {
      console.error('Nenhum arquivo selecionado para o campo:', imageField);
      return;
    }
  
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('userType', 'elenco');
    formData.append('imageField', imageField);
    formData.append('file', file); 
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}image`, {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        console.log(`${imageField} enviado com sucesso`);
      } else {
        const data = await response.json();
        console.error(`Erro ao enviar ${imageField}`, data.message);
      }
    } catch (error) {
      console.error(`Erro ao enviar ${imageField}`, error);
    }
  }

  const adcAtleta = async () => {
    const payload = {
      ...modalFieldsState,
      teamId,
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}elenco/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok) {
        
        toast.success('Atleta Cadastrado com sucesso!', {
          position: "top-center",
          autoClose: 2000,
          onClose: () => {
            window.location.reload(); 
          } 
        });
        localStorage.setItem('fotoAtleta', data.msg._id);
        return data.msg._id; 
      } else {
        setErrorMessage(data.message);
        return null; 
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setErrorMessage("Houve um problema ao conectar com o servidor.");
      return null; 
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