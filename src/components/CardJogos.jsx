import React, {useEffect, useState} from 'react';
import { Button, ModalEditarJogo, ModalSumulaJogo, ModalEditarSumulaJogo } from '../components';
import chroma from 'chroma-js';
import { toast } from 'react-toastify';

const CardCompetition = ({ 
  campeonatoId, userIdCasa, userIdFora, tipo, grupoId, data, local, hora, currentColor,jogoId, permissao
}) => {

  const [imageSrcCasa, setImageSrcCasa] = useState('');
  const [imageSrcFora, setImageSrcFora] = useState('');
  const [groups, setGroups] = useState([]);
  const [hover, setHover] = useState(false);
  const [userCasaInfo, setUserCasaInfo] = useState({});
  const [userForaInfo, setUserForaInfo] = useState({});
  const endColor = chroma(currentColor).darken(1).css();
  const endColor2 = chroma(currentColor).darken(2).css();
  const [showModalEditarJogo, setShowModalEditarJogo] = useState(false);
  const [showModalSumulaJogo, setShowModalSumulaJogo] = useState(false);
  const [showModalEditarSumulaJogo, setShowModalEditarSumulaJogo] = useState(false);
  const [jogoEstatisticas, setJogoEstatisticas] = useState(null);
  const [campos, setCampos] = useState([]);

  const linkStyle = {
    color: hover ? `${currentColor}` : 'inherit',
    cursor: 'pointer',
  };

  const deletarJogo = async () => {
    if (!jogoId) {
      toast.error("ID do jogo não especificado.");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}jogos/${jogoId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        toast.success("Jogo excluído com sucesso!", {
          position: "top-center",
          autoClose: 5000,
          onClose: (() =>
          window.location.reload()) 
        });
      } else {
        throw new Error('Falha ao excluir jogo.');
      }
    } catch (error) {
      console.error("Erro ao excluir jogo:", error);
      toast.error(`Erro ao excluir jogo: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}grupos/${grupoId}`);
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

    const apiUrl = `${process.env.REACT_APP_API_URL}image/blob`;

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

    const apiUrl = `${process.env.REACT_APP_API_URL}image/blob`;

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
        const response = await fetch(` ${process.env.REACT_APP_API_URL}users/${userCasa}`);
       
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
        const response = await fetch(` ${process.env.REACT_APP_API_URL}users/${userFora}`);
       
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

  useEffect(() => {
    const fetchEstatisticasJogo = async () => {
        try {
            const response = await fetch(` ${process.env.REACT_APP_API_URL}estatistica/jogo/${jogoId}`);
            const data = await response.json();
            if (data.status === 200 && data.data.length > 0) {                
                const estatisticasJogo = data.data[0][0]; 
                console.log('Estatistica Jogo: ', estatisticasJogo)
                if (estatisticasJogo) {
                    setJogoEstatisticas(estatisticasJogo);
                } else {
                    console.error('Estatísticas do jogo não encontradas');
                    setJogoEstatisticas(null);
                }
            } else {
                console.error('Estatísticas do jogo não encontradas');
                setJogoEstatisticas(null);
            }
        } catch (error) {
            console.error('Erro ao buscar estatísticas do jogo:', error);
        }
    };

    if (jogoId) {
        fetchEstatisticasJogo();
    }
}, [jogoId]);

useEffect(() => {
  const fetchCampos = async () => {
    try {
      const response = await fetch(` ${process.env.REACT_APP_API_URL}campos/${local}`);
      const data = await response.json();
      console.log('Dados: ', data);
      setCampos(data.data); 
    } catch (error) {
      console.error("Erro ao buscar campeonatos:", error);
    }
  };

  fetchCampos();
}, []);

const linkMapsUrl = campos && campos.linkMaps 
? (campos.linkMaps.startsWith('http://') || campos.linkMaps.startsWith('https://') ? campos.linkMaps : `https://${campos.linkMaps}`)
: "#";


  return (

    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white text-center mt-10">
      <div className="flex flex-col items-center py-4"  >

          <ModalEditarJogo
            isVisible={showModalEditarJogo} 
            currentColor={currentColor} 
            grupoId={grupoId}
            jogoId = {jogoId}
            campeonatoId={campeonatoId} 
            timeCasa={userCasaInfo.data?.teamName}
            timeFora={userForaInfo.data?.teamName}
            campoId = {campos._id}
            grupoName = {groups?.name}
            campoName = {campos?.nome}
            onClose={() => {
              setShowModalEditarJogo(false);
          }}/>

          <ModalSumulaJogo
            isVisible={showModalSumulaJogo} 
            currentColor={currentColor} 
            jogoId = {jogoId}
            campeonatoId={campeonatoId} 
            timeCasa={userCasaInfo.data?._id}
            timeFora={userForaInfo.data?._id}
            nomeTimeCasa={userCasaInfo.data?.teamName}
            nomeTimeFora={userForaInfo.data?.teamName}
            onClose={() => {
              setShowModalSumulaJogo(false);
          }}/>

          <ModalEditarSumulaJogo
            isVisible={showModalEditarSumulaJogo} 
            currentColor={currentColor} 
            jogoId = {jogoId}
            campeonatoId={campeonatoId} 
            timeCasa={userCasaInfo.data?._id}
            timeFora={userForaInfo.data?._id}
            nomeTimeCasa={userCasaInfo.data?.teamName}
            nomeTimeFora={userForaInfo.data?.teamName}
            onClose={() => {
              setShowModalEditarSumulaJogo(false);
          }}/>
        
        <div className="flex justify-center items-center w-full px-6">
          {/* Container para o time de casa */}
          <div className="flex flex-col items-center">
              <img alt="Home Team Logo" src={userCasaInfo.data?.pictureBase64} className="h-16 w-16 object-cover" />
              <p className="text-gray-700 text-base mt-2">
                  {userCasaInfo.data?.teamName}
              </p>
          </div>
          
          {/* Container para os gols */}
          <div className="flex items-center mx-2">
              {/* Exibe gols do time de casa se estiverem disponíveis */}
              {jogoEstatisticas ? (
                  <span className="text-xl font-semibold">{jogoEstatisticas.userCasaGols}</span>
              ) : (
                  <span className="text-xl font-semibold">-</span> // Substitua "-" por espaço vazio se preferir
              )}
              <span className="text-xl font-semibold mx-1">X</span>
              {/* Exibe gols do time de fora se estiverem disponíveis */}
              {jogoEstatisticas ? (
                  <span className="text-xl font-semibold">{jogoEstatisticas.userForaGols}</span>
              ) : (
                  <span className="text-xl font-semibold">-</span> // Substitua "-" por espaço vazio se preferir
              )}
          </div>

          {/* Container para o time de fora */}
          <div className="flex flex-col items-center">
              <img alt="Away Team Logo" src={userForaInfo.data?.pictureBase64} className="h-16 w-16 object-cover" />
              <p className="text-gray-700 text-base mt-2">
                  {userForaInfo.data?.teamName}
              </p>
          </div>
      </div>

      <div className="mt-4 px-6">
        <p className="text-gray-700 text-sm">Tipo: {tipo}</p>
        <p className="text-gray-700 text-sm">Grupo: {groups.name}</p>
        <p className="text-gray-700 text-sm">Data: {data}</p>
        <a
          target="_blank" rel="noopener noreferrer"
          href={linkMapsUrl}
          className="text-gray-700 text-sm mb-4"
          style={linkStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Local: {campos.nome}
        </a>
        <p className="text-gray-700 text-sm mb-4">Hora: {hora}</p>
        {permissao === 'admin' && (
          <>
            <div className="flex justify-between mb-2"> 
              <Button 
                color='white'
                bgColor={currentColor}
                text='Súmula'
                borderRadius='10px'
                size='sm'
                onClick={() => setShowModalSumulaJogo(true)}
                style={{ margin: '0 8px 0 0' }}
              /> 
              <Button 
                color='white'
                bgColor={endColor}
                text='Editar Jogo'
                borderRadius='10px'
                size='sm'
                onClick={() => setShowModalEditarJogo(true)}
                style={{ margin: '0 8px 0 0' }} 
              />
              <Button 
                color='white'
                bgColor='red'
                text='Excluir Jogo'
                borderRadius='10px'
                size='sm'
                onClick={() => deletarJogo()}
              />
            </div>
          </>
        )}
      </div>

      </div>
    </div>

  );
};

export default CardCompetition;
