import React, { useState, useEffect } from 'react'; 
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import Input from './Input';
import { toast } from 'react-toastify';
import { ModalTransferenciaFields } from '../constants/formFields';

const fields = ModalTransferenciaFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalTransferencia = ({ isVisible, onClose, currentColor, atletaNome, atletaId, teamId }) => {
  if (!isVisible) return null;
  
  const [clubes, setClubes] = useState([]);
  const [selectedClubeId, setSelectedClubeId] = useState('');
  const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => {
    setSelectedClubeId(e.target.value);
  };

  const handleFieldChange = (e) => {
    const { id, value } = e.target;
    setModalFieldsState(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };
  

  useEffect(() => {
    const fetchClubes = async () => {
      try {
        const response = await fetch(` http://0.tcp.sa.ngrok.io:17723/users/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        const clubesFiltrados = data.data.filter(clube => clube._id !== teamId);
        
        setClubes(clubesFiltrados);
        
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    };
  
    fetchClubes();
  }, [teamId]);

  console.log('clubes filtrados: ', clubes)

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    transferirAtleta();
  }

  const transferirAtleta = async () => {
    const requestBody = {
      novoTimeId: selectedClubeId,
      jogadorId: atletaId,
      motivo: modalFieldsState['motivo'],
      dataDeSolicitcao: modalFieldsState['data']
    };
  
    console.log("Body: ", requestBody);
  
    try {
      const response = await fetch(' http://0.tcp.sa.ngrok.io:17723/transferencia/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      if (data.status === 200) {
        toast.success(`Solicitação Realizada com Sucesso!`, {
          position: "top-center",
          autoClose: 5000, 
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
          <HeaderModal title={`Transferir o Atleta ${atletaNome}`} heading='Preencha todos os dados' />
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
            <div className="mt-4">
              <select
                id="selectedClubeId"
                value={selectedClubeId}
                onChange={handleChange}
                required
                className="mb-4"
              >
                <option value="">Selecione o Clube</option>
                {clubes.map((clube) => (
                  <option key={clube._id} value={clube._id}>
                    {clube.teamName}
                  </option>
                ))}
              </select>
              </div>     
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
                        handleChange={handleFieldChange}
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
            <FormAction currentColor={currentColor} text='Transferir' />
            </div>            
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalTransferencia;

