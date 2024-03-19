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
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate();

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => {
    setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const formData = new FormData();
    formData.append('name', modalFieldsState['nome']);
    formData.append('categoria', modalFieldsState['categoria']);
    formData.append('tipoCompeticao', modalFieldsState['tipoCompeticao']);
    formData.append('participantes', modalFieldsState['participantes']);
    formData.append('quantidadeGrupos', modalFieldsState['quantidadeGrupos']);
    formData.append('dataInicio', modalFieldsState['dataInicio']);
    formData.append('cidade', modalFieldsState['cidade']);
    formData.append('tipoGrupo', modalFieldsState['tipoGrupo']);
    formData.append('tipoMataMata', modalFieldsState['tipoMataMata']);
    formData.append('vagas', modalFieldsState['participantes']);
  
    const fileField = document.querySelector("input[type='file']");
    if (fileField && fileField.files[0]) {
      formData.append('file', fileField.files[0]);
    }

    for (let [key, value] of formData.entries()) { 
      console.log(key, value);
    }
    
  
    try {
      const response = await fetch(' http://0.tcp.sa.ngrok.io:12599/campeonatos/', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      if (data.status === 200) {
        toast.success('Campeonato Cadastrado com sucesso!', {
          position: "top-center",
          autoClose: 5000,
          onClose: () => navigate('/campeonatos') 
        });
        console.log('Dados: ', data);
      } else {
        setErrorMessage(data.msg)
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