import React, { useState, useEffect } from 'react'; 
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { toast } from 'react-toastify';

const ModalInscricaoCampeonato = ({ isVisible, onClose, currentColor, atletaNome, atletaId, teamId }) => {
  if (!isVisible) return null;
  
  const [campeonatos, setCampeonatos] = useState([]);
  const [selectedCampeonatoId, setSelectedCampeonatoId] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => {
    setSelectedCampeonatoId(e.target.value);
  };

  useEffect(() => {
    const fetchCampeonatosInscritos = async () => {
      try {
        const response = await fetch(` ${process.env.REACT_APP_API_URL}inscricoes/user/${teamId}`);
        const data = await response.json();

        const campeonatoIds = data.data.map(item => item.campeonatoId);

        const campeonatoDetailsPromises = campeonatoIds.map(_id =>
          fetch(` ${process.env.REACT_APP_API_URL}campeonatos/${_id}`)
          .then(response => response.json())
        );

        const campeonatosDetails = await Promise.all(campeonatoDetailsPromises);
        const validCampeonatos = campeonatosDetails.filter(detail => detail.data != null);

        setCampeonatos(validCampeonatos.map(detail => detail.data));
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    };

    
    fetchCampeonatosInscritos();
    
  }, [teamId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    verificarStatus();
    inscreverAtleta();
  }

  const verificarStatus = async (teamId, selectedCampeonatoId) => {
    try {
      const response = await fetch(` ${process.env.REACT_APP_API_URL}sumula/team/${teamId}`);
      const data = await response.json();

      const count = data.data && data.data.reduce ? data.data.reduce((acc, obj) => {
        if (obj.campeonatoId === selectedCampeonatoId) {
          return acc + 1;
        }
        return acc;
      }, 0) : 0;
  
      const status = count <= 29 ? 'ativo' : 'banco';
      console.log('Count:', count);
      console.log('Status:', status);
  
      return status;
    } catch (error) {
      console.error('Erro ao obter os dados:', error.message);
      throw new Error('Erro ao obter os dados');
    }
  };
  
  const inscreverAtleta = async () => {
    try {
      const status = await verificarStatus(teamId, selectedCampeonatoId);
  
      const requestBody = {
        campeonatoId: selectedCampeonatoId,
        userId: teamId,
        elencoId: atletaId,
        status: status
      };
      console.log('Request Body:', requestBody);
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}sumula/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      if (data.status === 200) {
        toast.success(`Atleta Inscrito com Sucesso!`, {
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
  }; 
  

  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
      <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
        <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
          X
        </button>
        <div className='bg-white p-2 rounded' style={{maxHeight: '100%', overflowY: 'auto'}}>
          <HeaderModal title={`Inscrever o Atleta ${atletaNome}`} heading='Preencha todos os dados' />
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
                id="selectedCampeonatoId"
                value={selectedCampeonatoId}
                onChange={handleChange}
                required
                className="mb-4"
              >
                <option value="">Selecione o Campeonato</option>
                {campeonatos.map((campeonato) => (
                  <option key={campeonato._id} value={campeonato._id}>
                    {campeonato.name}
                  </option>
                ))}
              </select>
              </div>            
            <FormAction currentColor={currentColor} text='Inscrever' />
            </div>            
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalInscricaoCampeonato;

