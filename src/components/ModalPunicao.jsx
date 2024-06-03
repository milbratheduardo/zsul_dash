import React, { useState, useEffect } from 'react';
import { ModalAdicionarPunicaoFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const fields = ModalAdicionarPunicaoFields;
let fieldsState = [];
fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalAdcPunicao = ({ isVisible, onClose, currentColor }) => {
  if (!isVisible) return null;

  const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState("");
  const [campeonatos, setCampeonatos] = useState([]);
  const [times, setTimes] = useState([]);
  const [atletas, setAtletas] = useState([]);
  const [selectedCampeonatoId, setSelectedCampeonatoId] = useState('');
  const [selectedTimeId, setSelectedTimeId] = useState('');
  const navigate = useNavigate();

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setModalFieldsState({ ...modalFieldsState, [id]: value });

    if (id === 'campeonato') {
      setSelectedCampeonatoId(value);
    } else if (id === 'time') {
      setSelectedTimeId(value);
    }
  };

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}campeonatos/`);
        const data = await response.json();
        setCampeonatos(data.data); 
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    };

    fetchCampeonatos();
  }, []);

  useEffect(() => {
    if (selectedCampeonatoId) {
      const fetchTimes = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}inscricoes/campeonato/${selectedCampeonatoId}`);
          const data = await response.json();
          console.log('TESTE: ', data)
          setTimes(data.data);
          setAtletas([]); 
        } catch (error) {
          console.error("Erro ao buscar times:", error);
        }
      };

      fetchTimes();
    }
  }, [selectedCampeonatoId]);

  useEffect(() => {
    if (selectedTimeId) {
      const fetchAtletas = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}sumula/campeonato/${selectedCampeonatoId}`);
          const data = await response.json();
          const filteredAtletas = data.data.filter(atleta => atleta.userId === selectedTimeId);
          setAtletas(filteredAtletas);
        } catch (error) {
          console.error("Erro ao buscar atletas:", error);
        }
      };

      fetchAtletas();
    }
  }, [selectedTimeId, selectedCampeonatoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jsonData = {
      field: "punicao",
      value: modalFieldsState.punicao,
      campeonatoId: selectedCampeonatoId,
      jogadorId: modalFieldsState.atleta
    };

    console.log("JSON: ", jsonData)

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}estatisticaJogador/campeonato/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      const data = await response.json();

      if (data.status === 200) {
        toast.success(`Punição cadastrada com sucesso!`, {
          position: "top-center",
          autoClose: 5000,
          onClose: (() => navigate(`/punicoes`), window.location.reload())
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
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
      <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
        <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
          X
        </button>
        <div className='bg-white p-2 rounded' style={{ maxHeight: '100%', overflowY: 'auto' }}>
          <HeaderModal title='Adicionar Punição' heading='Preencha todos os dados' />
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
              <select id="campeonato" onChange={handleChange} value={selectedCampeonatoId} className='mb-4'>
                <option value=''>Selecione um campeonato</option>
                {campeonatos.map((campeonato) => (
                  <option key={campeonato._id} value={campeonato._id}>{campeonato.name}</option>
                ))}
              </select>
              <select id="time" onChange={handleChange} value={selectedTimeId} className='mb-4' disabled={!selectedCampeonatoId}>
                <option value=''>Selecione uma equipe</option>
                {times.map((time) => (
                  <option key={time.userId} value={time.userId}>{time.userName}</option>
                ))}
              </select>
              <select id="atleta" onChange={handleChange} value={modalFieldsState.atleta} className='mb-4' disabled={!selectedTimeId}>
                <option value=''>Selecione um atleta</option>
                {atletas.map((atleta) => (
                  <option key={atleta.elencoId} value={atleta.elencoId}>{atleta.elencoName}</option>
                ))}
              </select>
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
                        <option value='' disabled>{field.placeholder}</option>
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

export default ModalAdcPunicao;
