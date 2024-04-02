import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';
import { toast } from 'react-toastify';

const CardCompetition = ({
  image, title, type, participants, vacancies, city, category, date, teamId, currentColor, id, permissao, status, showViewDetailsButton
}) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleViewDetails = () => { 
    navigate(`/campeonatos/${id}`);
  };

  const inscreverTime = async () => {
    const payload = {
      userId: teamId, 
      campeonatoId: id 
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}inscricoes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.status === 200) {
        toast.success('Equipe Inscrita com sucesso!', {
          position: "top-center",
          autoClose: 5000,
          onClose: () => navigate('/sumulas') 
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
        Status: {status === 'aberto' ? 'Aberto para Inscrições' : 
          status === 'fechado' ? 'Fechado para Inscrições' : 
          status === 'finalizado' ? 'Campeonato Finalizado' : status}
        </p>
        <p className="text-gray-700 text-base">
          Data de Início: {date}
        </p>
        <p className="text-gray-700 text-base mb-4"> 
          Cidade: {city}
        </p>
        {showViewDetailsButton && (
        <Button 
          color='white'
          bgColor={currentColor}
          text='Ver Detalhes'
          borderRadius='10px'
          size='sm'
          onClick={handleViewDetails} 
        />
        )}
         {permissao !== 'admin' && status === 'aberto' && (
            <Button 
              color='white'
              bgColor='green'
              text='Inscrever-se'
              borderRadius='10px'
              size='sm'
              onClick={() => {
                inscreverTime();
              }}
            />
            )}
      </div>
    </div>
  );
};

export default CardCompetition;
