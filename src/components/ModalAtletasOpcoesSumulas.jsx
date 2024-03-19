import React, { useState, useEffect } from 'react';
import HeaderModal from './HeaderModal';
import { toast } from 'react-toastify';

const ModalAtletasOpcoesSumulas = ({ isVisible, onClose, atletaNome, currentColor, atleta, teamId, campeonatoNome, campeonatoId }) => {
  if (!isVisible) return null;
  
  const [sumulaFiltrada, setSumulaFiltrada] = useState([]);

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  useEffect(() => {
    if (isVisible) {
      buscarSumula();
    }
  }, [isVisible, atleta, teamId, campeonatoId]);

  const buscarSumula = async () => {
    try {
      const response = await fetch(` http://0.tcp.sa.ngrok.io:17723/sumula/`);
      const resultado = await response.json();
  
      if (!response.ok) throw new Error('Erro ao buscar súmulas');
      
      const sumulas = resultado.data;
  
      const filtrada = sumulas.filter(sumula => 
        sumula.campeonatoId === campeonatoId &&
        sumula.elencoId === atleta._id &&
        sumula.userId === teamId
      );
  
      setSumulaFiltrada(filtrada);
  
      if (filtrada.length > 0) {
        console.log('Súmula encontrada:', filtrada[0]);
      } else {
        console.log('Nenhuma súmula correspondente encontrada');
      }
    } catch (error) {
      console.error('Erro ao buscar súmulas:', error.message);
    }
  };

  const excluirSumula = async (e) => {
    e.preventDefault();
    if (sumulaFiltrada.length > 0) {
      try {
        const response = await fetch(` http://0.tcp.sa.ngrok.io:17723/sumula/${sumulaFiltrada[0]._id}`, {
          method: 'DELETE',
        });
    
        const data = await response.json();
        if (data.status === 200) {
          toast.success('Atleta Excluído com Sucesso!', {
            position: "top-center",
            autoClose: 5000,
          });
          
        } else {
          
          console.error('Erro ao Excluir Atleta:', data.msg);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }; 

  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
      <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
        <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
          X
        </button>
        <div className='bg-white p-2 rounded' style={{ maxHeight: '100%', overflowY: 'auto' }}>
          <HeaderModal title={`Opções para ${atletaNome} no ${campeonatoNome}`} heading='Escolha uma ação' />
          <form className='mt-4 space-y-4' onSubmit={excluirSumula}> {/* Adicionado onSubmit para o formulário */}
            <div className='flex flex-wrap justify-center gap-2'>
              <button
                type='submit' // Certifique-se de que o botão seja do tipo 'submit' para acionar o onSubmit do form
                className='text-white py-2 px-4 rounded w-full sm:w-1/2'
                style={{ backgroundColor: currentColor }}
              >
                Excluir Atleta
              </button>
              <div className='w-full' aria-hidden='true'></div>
            </div>    
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalAtletasOpcoesSumulas;
