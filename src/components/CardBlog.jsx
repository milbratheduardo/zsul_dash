import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';
import { toast } from 'react-toastify';

const CardCompetition = ({
   image, title, descricao, id, currentColor,showViewDetailsButton,
}) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");


  const deletarPost = async () => {
    try {
      const response = await fetch(` ${process.env.REACT_APP_API_URL}blog/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.status === 200) {
        toast.success('Post Deletado com sucesso!', {
          position: "top-center",
          autoClose: 5000,
          onClose: (() => navigate('/blog')) 
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
          Descrição: {descricao}
        </p>
        {showViewDetailsButton && (
        <Button 
          color='white'
          bgColor='red'
          text='Excluir'
          borderRadius='10px'
          size='sm'
          onClick={() => {
            deletarPost();
          }} 
        />
        )}
         
      </div>
    </div>
  );
};

export default CardCompetition;
