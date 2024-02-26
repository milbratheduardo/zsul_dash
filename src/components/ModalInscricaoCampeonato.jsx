import React, { useState, useEffect } from 'react';
import CardCompetition from './CardCompetition'; // Ajuste o caminho do import conforme necessário

const ModalInscricaoCampeonato = ({ isVisible, onClose, currentColor }) => {
  const [campeonatos, setCampeonatos] = useState([]);

  // Iniciando o fetch dos campeonatos quando o modal se torna visível
  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const response = await fetch('http://localhost:3000/campeonatos/');
        const data = await response.json();
        setCampeonatos(data.data);
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    };

    if (isVisible) {
      fetchCampeonatos();
    }
  }, [isVisible]);

  // Se o modal não estiver visível, não renderiza nada
  if (!isVisible) return null;

  // Função para fechar o modal ao clicar fora
  const handleCloseClickOutside = (event) => {
    if (event.target.id === 'modalInscricaoWrapper') {
      onClose();
    }
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
                currentColor={currentColor}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalInscricaoCampeonato;
