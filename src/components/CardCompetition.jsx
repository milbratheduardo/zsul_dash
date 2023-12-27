import React from 'react'

const CardCompetition = ({ image, title, type, participants, vacancies, city, category, date }) => {
    return (
      <div className="max-w-sm rounded overflow-hidden shadow-lg text-center">
        <img className="w-full" src={image} alt={title} />
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
          <p className="text-gray-700 text-base">
            Cidade: {city}
          </p>
        </div>
      </div>
    );
  };
  
export default CardCompetition