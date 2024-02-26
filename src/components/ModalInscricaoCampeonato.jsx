import React, { useState, useEffect } from 'react';
import CardCompetition from './CardCompetition'; 

const ModalInscricaoCampeonato = ({ isVisible, onClose, currentColor }) => {
  const [campeonatos, setCampeonatos] = useState([]);

  useEffect(() => {
    const fetchCampeonatosInscritos = async () => {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const teamId = user.data.id; 
      console.log('teamId:', teamId);
      try {
        const response = await fetch(`http://localhost:3000/inscricoes/user/${teamId}`);
        const data = await response.json();

        const campeonatoIds = data.data.map(item => item.campeonatoId);

        const campeonatoDetailsPromises = campeonatoIds.map(_id =>
          fetch(`http://localhost:3000/campeonatos/${_id}`)
          .then(response => response.json())
        );

        const campeonatosDetails = await Promise.all(campeonatoDetailsPromises);
        const validCampeonatos = campeonatosDetails.filter(detail => detail.data != null);

        setCampeonatos(validCampeonatos.map(detail => detail.data));
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    };

    if (isVisible) {
      fetchCampeonatosInscritos();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleCloseClickOutside = (event) => {
    if (event.target.id === 'modalInscricaoWrapper') {
      onClose();
    }
  };
  const handleInscribe = async (campeonatoId) => {
    localStorage.setItem('selectedCampeonatoId', campeonatoId);

    alert(`Campeonato ${campeonatoId} inscrito com sucesso!`);
  
  
    const selectedCampeonatoId = localStorage.getItem('selectedCampeonatoId');
    const selectedTeamId = localStorage.getItem('selectedTeamId');
    const selectedAtletaId = localStorage.getItem('selectedAtletaId');
  
    const requestBody = {
      campeonatoId: selectedCampeonatoId,
      userId: selectedTeamId,
      elencoId: selectedAtletaId,
    };
  
    try {

      const response = await fetch('http://localhost:3000/sumula/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
   
        const responseData = await response.json();
        console.log('Resposta da requisição:', responseData);

      } else {
   
        console.error('Erro na requisição:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao fazer requisição:', error);
    }
  
    onClose(); 
  };
  return (
    <div
      id='modalInscricaoWrapper'
      className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'
      onClick={handleCloseClickOutside}
    >
      <div
        className='relative w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col bg-white p-2 rounded'
        style={{ maxHeight: '600px', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#fff',
            color: '#000',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
          }}
        >
          X
        </button>
        <div className="pt-4 px-4 pb-4">
          <h2 className="text-center mb-4">Inscrição em Campeonato</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {campeonatos.map((campeonato) => (
              <CardCompetition
                key={campeonato._id}
                image={campeonato.pictureBase64}
                title={campeonato.name}
                category={campeonato.categoria}
                type={campeonato.tipoCompeticao}
                participants={campeonato.participantes}
                vacancies={campeonato.vagas}
                date={campeonato.dataInicio}
                city={campeonato.cidade}
                showViewDetailsButton={false}
                currentColor={currentColor}
                showInscribeButton={true} 
    onInscribeClick={() => handleInscribe(campeonato._id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalInscricaoCampeonato;
``
