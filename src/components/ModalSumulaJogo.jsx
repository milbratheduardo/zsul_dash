import React, { useState, useEffect } from 'react';
import { ModalSumulaJogoFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../components'


const fields = ModalSumulaJogoFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalSumulaJogo = ({ isVisible, onClose, currentColor, timeCasa, timeFora, jogoId, campeonatoId }) => {
  if (!isVisible) return null;

  const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState("")
  const [atletasTimeCasa, setAtletasTimeCasa] = useState([])
  const [atletasTimeFora, setAtletasTimeFora] = useState([])
  const [selects, setSelects] = useState([]);
  const navigate = useNavigate();

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => {
    setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });
  };

  const handleAddStatistic = () => {
    setSelects(prevSelects => [...prevSelects, {id: `select-${prevSelects.length}`, value: ''}]);
  };

  const handleChangeSelect = (id, elencoId) => {
    setSelects(prevSelects => prevSelects.map(select => {
        if (select.id === id) {
            const atleta = [...atletasTimeCasa, ...atletasTimeFora].find(atleta => atleta.elencoId === elencoId);
            return { ...select, value: elencoId, teamId: atleta ? atleta.teamId : undefined };
        }
        return select;
    }));
};

  const handleInputChange = (field, index, value) => {
    setSelects(prevSelects => prevSelects.map((select, idx) => {
      if (idx === index) {
        return { ...select, [field]: value };
      }
      return select;
    }));
  };
  

  useEffect(() => {
    const fetchTimeCasa = async () => {
        try {
            const url = `http://localhost:3000/sumula/campeonato/${campeonatoId}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.status === 200) {         
                const filteredData = data.data.filter(item => item.userId === timeCasa);
                
                const atletasDetailsPromises = filteredData.map(async (item) => {
                    const elencoResponse = await fetch(`http://localhost:3000/elenco/${item.elencoId}`);
                    const elencoData = await elencoResponse.json();
                    
                    if (elencoData.status === 200 && elencoData.data) {
                        console.log("Elenco Data for item:", item.elencoId, elencoData); 
                        return { elencoId: item.elencoId, name: elencoData.data.name, teamId: timeCasa }; 
                    } else {
                        return { elencoId: item.elencoId, name: 'Nome não encontrado', teamId: timeCasa };
                    }
                });
                
                const atletasDetails = await Promise.all(atletasDetailsPromises);
                console.log("Final Time Casa: ", atletasDetails); 
                setAtletasTimeCasa(atletasDetails); // Atualiza o estado com os detalhes dos atletas
            } else {
                console.error('Erro na resposta da API:', data.msg);
                setAtletasTimeCasa([]);
            }
        } catch (error) {
            console.error("Erro ao buscar dados do time de casa:", error);
            setAtletasTimeCasa([]);
        }
    };

    fetchTimeCasa();
}, [timeCasa, campeonatoId]);  

useEffect(() => {
  const fetchTimeFora = async () => {
      try {
          const url = `http://localhost:3000/sumula/campeonato/${campeonatoId}`;
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.status === 200) {
              const filteredData = data.data.filter(item => item.userId === timeFora);
              
              const atletasDetailsPromises = filteredData.map(async (item) => {
                  const elencoResponse = await fetch(`http://localhost:3000/elenco/${item.elencoId}`);
                  const elencoData = await elencoResponse.json();
                  
                  if (elencoData.status === 200 && elencoData.data) {
                      return { elencoId: item.elencoId, name: elencoData.data.name, teamId: timeFora };
                  } else {
                      return { elencoId: item.elencoId, name: 'Nome não encontrado', teamId: timeFora };
                  }
              });
              
              const atletasDetails = await Promise.all(atletasDetailsPromises);
              setAtletasTimeFora(atletasDetails);
          } else {
              setAtletasTimeFora([]);
          }
      } catch (error) {
          console.error("Erro ao buscar dados do time de fora:", error);
          setAtletasTimeFora([]);
      }
  };

  fetchTimeFora();
}, [timeFora, campeonatoId]);

  


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const resultadoJogo = {
      campeonatoId: campeonatoId,
      jogoId: jogoId,
      userCasaGols: modalFieldsState.userCasaGols, 
      userForaGols: modalFieldsState.userForaGols,
    };

    const responseJogo = await fetch('http://localhost:3000/estatistica/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resultadoJogo),
    });

    const dataJogo = await responseJogo.json();
    if (dataJogo.status === 200) {
      toast.success('Resultado do jogo enviado com sucesso!');
    } else {
      toast.error('Erro ao enviar resultado do jogo');
      return; 
    }
  } catch (error) {
    console.error('Erro ao enviar resultado do jogo:', error);
    toast.error('Erro ao enviar resultado do jogo');
    return; 
  }

  const estatisticasPromessas = selects.map(async (select) => {
    const estatisticaJogador = {
      campeonatoId: campeonatoId,
      jogoId: jogoId,
      teamId: select.teamId, 
      jogadorId: select.value, 
      gols: select.gols || "0",
      numeroCartoesAmarelo: select.amarelos || "0",
      numeroCartoesVermelho: select.vermelhos || "0",
    };

    console.log('estatistica: ', estatisticaJogador)

    const responseEstatistica = await fetch('http://localhost:3000/estatistica/jogador', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(estatisticaJogador),
    });

    return responseEstatistica.json(); 
  });

  Promise.all(estatisticasPromessas).then((results) => {
    if (results.every(result => result.status === 200)) {
      toast.success('Todas as estatísticas dos jogadores foram enviadas com sucesso!');
    } else {
      toast.error('Erro ao enviar estatísticas de alguns jogadores.');
    }
  }).catch((error) => {
    console.error('Erro ao enviar estatísticas dos jogadores:', error);
    toast.error('Erro ao enviar estatísticas dos jogadores');
  });
};
  

  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
      <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
        <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
          X
        </button>
        <div className='bg-white p-2 rounded' style={{ maxHeight: '100%', overflowY: 'auto' }}>
          <HeaderModal title='Cadastre nova Súmula da Partida' heading='Preencha todos os dados' />
          <form className='mt-4 space-y-4' onSubmit={handleSubmit}>
            {errorMessage && (
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
            )}
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
                      {field.type === 'file' && (
                        <label className='block text-sm font-medium text-gray-700 mt-4 ml-3'>{field.labelText}</label>
                      )}
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
              <Button 
                color={currentColor}
                bgColor='white'
                text='Estatística dos Jogadores'
                borderRadius='10px'
                size='sm'
                onClick={handleAddStatistic}
                />

              {selects.map((select, index) => (
                <div key={select.id} className="flex items-center space-x-2 mt-2">
                  <select
                    id={`player-${select.id}`}
                    value={select.value}
                    onChange={(e) => handleChangeSelect(select.id, e.target.value)}
                    className='p-2 block w-1/2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  >
                    <option value="">Selecione um atleta</option>
                    {[...atletasTimeCasa, ...atletasTimeFora].map((atleta, idx) => (
                      <option key={`${atleta.elencoId}-${idx}`} value={atleta.elencoId}>
                        {atleta.name}
                      </option>
                    ))}
                  </select>

                  {/* Gols */}
                  <input
                    type="number"
                    placeholder="Gols"
                    className='p-2 block w-1/6 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                    min="0"
                    onChange={(e) => handleInputChange('gols', index, e.target.value)}
                  />

                  {/* Cartões Amarelos */}
                  <input
                    type="number"
                    placeholder="Amarelos"
                    className='p-2 block w-1/6 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                    min="0"
                    onChange={(e) => handleInputChange('amarelos', index, e.target.value)}
                  />

                  {/* Cartões Vermelhos */}
                  <input
                    type="number"
                    placeholder="Vermelhos"
                    className='p-2 block w-1/6 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                    min="0"
                    onChange={(e) => handleInputChange('vermelhos', index, e.target.value)}
                  />
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

export default ModalSumulaJogo;