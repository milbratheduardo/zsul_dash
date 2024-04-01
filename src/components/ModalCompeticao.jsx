import React, { useState } from 'react';
import { ModalCompeticaoFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const fields = ModalCompeticaoFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalCompeticao = ({ isVisible, onClose, currentColor }) => {
  if (!isVisible) return null;

  const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => {
    setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      name: modalFieldsState['nome'],
      categoria: modalFieldsState['categoria'],
      tipoCompeticao: modalFieldsState['tipoCompeticao'],
      participantes: modalFieldsState['participantes'],
      quantidadeGrupos: modalFieldsState['quantidadeGrupos'],
      dataInicio: modalFieldsState['dataInicio'],
      cidade: modalFieldsState['cidade'],
      tipoGrupo: modalFieldsState['tipoGrupo'],
      tipoMataMata: modalFieldsState['tipoMataMata'],
      vagas: modalFieldsState['participantes'],
    };

    
    const fileField = document.querySelector("input[type='file']");
    if (fileField && fileField.files[0]) {
      const reader = new FileReader();
      reader.onload = function () {
        const imageData = reader.result; 
        console.log('Base64 da imagem:', imageData); 
        requestData.file = imageData;
        sendRequest(requestData);
      };
      reader.readAsDataURL(fileField.files[0]);
    } else {
      sendRequest(requestData);
    }
  };

  const sendRequest = async (data) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}campeonatos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (responseData.status === 200) {
        toast.success('Campeonato Cadastrado com sucesso!', {
          position: "top-center",
          autoClose: 5000,
          onClose: () => navigate('/campeonatos') 
        });
        console.log('Dados: ', responseData);
      } else {
        setErrorMessage(responseData.msg)
        console.error('Erro ao cadastrar campeonato ' + errorMessage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
      <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
        <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
          X
        </button>
        <div className='bg-white p-2 rounded' style={{maxHeight: '100%', overflowY: 'auto'}}>
          <HeaderModal title='Cadastre nova Competição' heading='Preencha todos os dados' />
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
            <FormAction currentColor={currentColor} text='Cadastrar' />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalCompeticao;
