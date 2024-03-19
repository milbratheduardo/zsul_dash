import React, { useState, useEffect } from 'react';
import HeaderModal from './HeaderModal';
import FormAction from './FormAction';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ModalAtletaDocumentos = ({ isVisible, onClose, atleta, atletaNome, teamId, currentColor }) => {
  if (!isVisible) return null;
  const navigate = useNavigate();
  const [times, setTimes] = useState([]);
  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };


  useEffect(() => {
    const fetchTime = async () => {
        try {
          const response = await fetch(` http://0.tcp.sa.ngrok.io:17723/users/${atleta.teamId}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
    
          setTimes(data);
        } catch (error) {
          console.error('Fetch error:', error);
        }
      };     
  
    if (atleta._id) {
      fetchTime();
    }
  }, [atleta._id]);

  // Função para formatar o CPF
  const formatCPF = (cpf) => {
    const cpfRegex = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;
    return cpf.replace(cpfRegex, '$1.$2.$3-$4');
  };

  console.log('time: ', times )

  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
      <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
        <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
          X
        </button>
        <div className='bg-white p-2 rounded' style={{ maxHeight: '100%', overflowY: 'auto' }}>
          <HeaderModal title={`Documentos do ${atletaNome}`} heading='' />
          <form className='mt-4 space-y-4'>
            <div className="flex flex-col items-center justify-center gap-2">
              <h3 className="text-xl font-semibold leading-normal text-blueGray-700">
                Nome da Equipe
              </h3>
              <div className="text-blueGray-600">
                {times.data?.teamName || 'Carregando...'}
              </div>
              <div className='w-full' aria-hidden='true'></div>
              <h3 className="text-xl font-semibold leading-normal text-blueGray-700">
                RG Frente
              </h3>
              <div className="text-blueGray-600">
                {atleta?.RGVersoBase64 ? (
                  <div className='text-center' style={{ display: 'flex', justifyContent: 'center', objectFit: 'cover' }}>
                    <img src={atleta?.RGFrenteBase64} alt="RG Verso" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>Nenhuma imagem disponível</div>
                )}
              </div>
              <div className='w-full' aria-hidden='true'></div>
              <h3 className="text-xl font-semibold leading-normal text-blueGray-700">
                RG Verso
              </h3>
              <div className="text-blueGray-600">
                {atleta?.RGVersoBase64 ? (
                  <div className='text-center' style={{ display: 'flex', justifyContent: 'center', objectFit: 'cover' }}>
                    <img src={atleta?.RGVersoBase64} alt="RG Verso" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>Nenhuma imagem disponível</div>
                )}
              </div>
              <div className='w-full' aria-hidden='true'></div>
              <h3 className="text-xl font-semibold leading-normal text-blueGray-700">
                CPF
              </h3>
              <div className="text-blueGray-600">
                {atleta ? formatCPF(atleta.CPF) : 'Carregando...'}
              </div>
              <div className='w-full' aria-hidden='true'></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalAtletaDocumentos;
