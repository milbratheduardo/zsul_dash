import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';

const CardCompetition = ({
  image, title, type, participants, vacancies, city, category, date, currentColor, id
}) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => { 
    navigate(`/campeonatos/${id}`);
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg text-center">
      <img className="w-full h-48 object-cover" src={image} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">
          Categoria: {category}
        </p>
        <p className="text-gray-700 text-base">
          Tipo: {type}
        </p>
        <p className="text-gray-700 text-base">
          Participantes: {participants}
        </p>
        <p className="text-gray-700 text-base">
          Vagas Restantes: {vacancies}
        </p>
        <p className="text-gray-700 text-base">
          Data de Início: {date}
        </p>
        <p className="text-gray-700 text-base mb-4"> 
          Cidade: {city}
        </p>
        <Button 
          color='white'
          bgColor={currentColor}
          text='Ver Detalhes'
          borderRadius='10px'
          size='sm'
          onClick={handleViewDetails} 
        />
      </div>
    </div>
  );
};

export default CardCompetition;
