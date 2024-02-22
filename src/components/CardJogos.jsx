import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';
import chroma from 'chroma-js';

const CardCompetition = ({
  campeonatoId, userIdCasa, userIdFora, tipo, grupoId, data, local, hora, currentColor
}) => {
  const navigate = useNavigate();
  const [imageSrcCasa, setImageSrcCasa] = useState('');
  const [imageSrcFora, setImageSrcFora] = useState('');
  const [groups, setGroups] = useState([]);
  const [userCasaInfo, setUserCasaInfo] = useState({});
  const [userForaInfo, setUserForaInfo] = useState({});
  const endColor = chroma(currentColor).darken(1).css();
  
  const editarJogo = () => { 
    setShowModalEditarJogo(true);
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`http://localhost:3000/grupos/${grupoId}`);
        const data = await response.json();
        if (data.status === 200 && data.data) {
          setGroups(data.data);
        } else {
          toast.error('Failed to fetch groups');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('An error occurred while fetching groups');
      }
    };

    fetchGroups();
  }, [campeonatoId]);

  useEffect(() => {
    const imageData = {
      userId: userIdCasa,
      userType: "user",
      imageField: "picture"
    };

    const apiUrl = 'http://localhost:3000/image/blob';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(imageData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Resposta da API:', data);
      if (data.data !== '' && data.data !== null) {
        setImageSrcCasa(data.data);
        console.log(`: ${data.data}`);
      }
    })
    .catch((error) => {
      console.error(`Fetch error: ${error}`);
    });
  }, []);

  useEffect(() => {
    const imageData = {
      userId: userIdFora,
      userType: "user",
      imageField: "picture"
    };

    const apiUrl = 'http://localhost:3000/image/blob';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(imageData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Resposta da API:', data);
      if (data.data !== '' && data.data !== null) {
        setImageSrcFora(data.data);
        console.log(`: ${data.data}`);
      }
    })
    .catch((error) => {
      console.error(`Fetch error: ${error}`);
    });
  }, []);

  useEffect(() => {
    const fetchUserCasaInfo = async () => {
      const userCasa = userIdCasa;
      try {
        const response = await fetch(`http://localhost:3000/users/${userCasa}`);
       
        if (response.ok) {
          const data = await response.json();
          setUserCasaInfo(data);
          console.log('Dados: ', data);
        } else {
          console.error('Erro ao buscar dados do usuário');
        }
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    };

    if (userIdCasa) {
      fetchUserCasaInfo();
    }
  }, [userIdCasa]); 

  useEffect(() => {
    const fetchUserForaInfo = async () => {
      const userFora = userIdFora;
      try {
        const response = await fetch(`http://localhost:3000/users/${userFora}`);
       
        if (response.ok) {
          const data = await response.json();
          setUserForaInfo(data);
          console.log('Dados: ', data);
        } else {
          console.error('Erro ao buscar dados do usuário');
        }
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    };

    if (userIdFora) {
      fetchUserForaInfo();
    }
  }, [userIdFora]); 


  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white text-center mt-10">
      <div className="flex flex-col items-center py-4">
        <div className="flex justify-between items-center w-full px-6">
          <div className="flex flex-col items-center">
            <img alt="Home Team Logo" src={imageSrcCasa} className="h-32 w-32 rounded-full object-cover" />
            <p className="text-gray-700 text-base mt-2">
              {userCasaInfo.data?.teamName}
            </p>
          </div>
          <span className="text-xl font-semibold">X</span>
          <div className="flex flex-col items-center">
            <img alt="Away Team Logo" src={imageSrcFora} className="h-32 w-32 rounded-full object-cover" />
            <p className="text-gray-700 text-base mt-2">
              {userForaInfo.data?.teamName}
            </p>
          </div>
        </div>
        <div className="mt-4 px-6">
          <p className="text-gray-700 text-sm">
            Tipo: {tipo}
          </p>
          <p className="text-gray-700 text-sm">
            Grupo: {groups.name}
          </p>
          <p className="text-gray-700 text-sm">
            Data: {data}
          </p>
          <p className="text-gray-700 text-sm mb-4"> 
            Local: {local}
          </p>
          <p className="text-gray-700 text-sm mb-4"> 
            Hora: {hora}
          </p>
          <Button 
          color='white'
          bgColor={currentColor}
          text='Súmula'
          borderRadius='10px'
          size='sm'
          onClick={() => {}} 
        />
        <Button 
          color='white'
          bgColor={endColor}
          text='Editar Jogo'
          borderRadius='10px'
          size='sm'
          onClick={() => {}} 
        />
        </div>
      </div>
    </div>

  );
};

export default CardCompetition;
