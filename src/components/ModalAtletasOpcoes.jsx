import React, { useState } from 'react';
import HeaderModal from './HeaderModal';


const ModalAtletasOpcoes = ({ isVisible, onClose, atletaNome }) => {
    if (!isVisible) return null;

    const handleClose = (e) => {
        if (e.target.id === 'wrapper') onClose();
      };
    
    const funcao1 = {

      };

    const funcao2 = {

      };

    const funcao3 = {

      };

    const funcao4 = {

      };

    const funcao5 = {

      };


    return (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
          <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
            <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
              X
            </button>
            <div className='bg-white p-2 rounded' style={{maxHeight: '100%', overflowY: 'auto'}}>
              <HeaderModal title={`Opções para ${atletaNome}`} heading='Escolha uma ação' />
              <form className='mt-4 space-y-4'>    
                
                <div className='flex flex-wrap justify-center gap-2'>
                  <button className='bg-blue-500 text-white py-2 px-4 rounded w-full sm:w-1/2'>Gerar Carteirinha</button>
                  <button className='bg-green-500 text-white py-2 px-4 rounded w-full sm:w-1/2'>Solicitar Transferência</button>
                  <div className='w-full' aria-hidden='true'></div>
                  <button className='bg-red-500 text-white py-2 px-4 rounded w-full sm:w-1/2'>Demitir Atleta</button>
                  <button className='bg-yellow-500 text-white py-2 px-4 rounded w-full sm:w-1/2'>Inscrever em Campeonato</button>
                  <div className='w-full' aria-hidden='true'></div>
                  <button className='bg-purple-500 text-white py-2 px-4 rounded w-full sm:w-1/2'>Estatísticas</button>
                </div>    
                
              </form>
            </div>
          </div>
        </div>
      );
    };
    
export default ModalAtletasOpcoes;