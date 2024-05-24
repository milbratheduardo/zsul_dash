import React, { useState, useEffect } from 'react';
import HeaderModal from './HeaderModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ModalEstatisticaAtleta = ({ isVisible, onClose, currentColor, teamId, atletaId, atletaNome }) => {
  if (!isVisible) return null;

  const [atletaInfo, setAtletaInfo] = useState({ estatisticas: {}, isLoading: true });
  const navigate = useNavigate();

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  useEffect(() => {
    const fetchAtletaInfo = async () => {
      try {
        const [atletaResponse, estatisticasResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}elenco/${atletaId}`),
          fetch(`${process.env.REACT_APP_API_URL}estatistica/jogador/${atletaId}`)
        ]);

        if (atletaResponse.ok && estatisticasResponse.ok) {
          const atletaData = await atletaResponse.json();
          const estatisticasData = await estatisticasResponse.json();
          setAtletaInfo({ ...atletaData.data[0], estatisticas: estatisticasData.data, isLoading: false });
        } else {
          console.error('Erro ao buscar dados do atleta e estatísticas');
          toast.error('Erro ao carregar informações do atleta.');
          setAtletaInfo({ estatisticas: {}, isLoading: false });
        }
      } catch (error) {
        console.error('Erro na solicitação:', error);
        toast.error('Erro na conexão ao tentar buscar informações do atleta.');
        setAtletaInfo({ estatisticas: {}, isLoading: false });
      }
    };

    if (teamId && atletaId) {
      fetchAtletaInfo();
    }
  }, [teamId, atletaId]);

  console.log("ESTATISTICAS: ", atletaInfo)

  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
      <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
        <button className='text-white text-xl place-self-end' onClick={onClose}>
          X
        </button>
        <div className='bg-white p-2 rounded' style={{ maxHeight: '100%', overflowY: 'auto' }}>
          <HeaderModal title={`Estatísticas de ${atletaNome}`} />
          <div className="mt-4 flex flex-col items-center gap-4">
            {atletaInfo.isLoading ? (
              <p>Carregando...</p>
            ) : (
              <>
                <img alt="Perfil" src={atletaInfo?.fotoAtletaBase64} className="h-20 w-20 rounded-full object-cover" />
                <div className="text-center space-y-2 pb-10">
                  <div className="text-xl font-semibold">Gols: {atletaInfo.estatisticas?.[0]?.gols || '0'}</div>
                  <div className="text-xl font-semibold">Cartões Amarelos: {atletaInfo.estatisticas?.[0]?.numeroCartoesAmarelo || '0'}</div>
                  <div className="text-xl font-semibold">Cartões Vermelhos: {atletaInfo.estatisticas?.[0]?.numeroCartoesVermelho || '0'}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEstatisticaAtleta;
