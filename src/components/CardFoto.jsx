import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';
import { toast } from 'react-toastify';

const CardCompetition = ({
   image, title, descricao, id, currentColor,showViewDetailsButton, instagram
}) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg text-center">
      <img className="w-full h-48 object-cover" src={image} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">
          Nome do Fotógrafo: {descricao}
        </p>
        <p className="text-gray-700 text-base">
          Instagram: {instagram}
        </p>
        {showViewDetailsButton && (
        <Button 
          color='white'
          bgColor='red'
          text='Excluir'
          borderRadius='10px'
          size='sm'
          onClick={''} 
        />
        )}
         
      </div>
    </div>
  );
};

export default CardCompetition;
