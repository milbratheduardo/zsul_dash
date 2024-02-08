import React, { useState } from 'react';
import HeaderModal from './HeaderModal';


const ModalClubeOpcoes = ({ isVisible, onClose, clubeNome, teamId }) => {
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
              <HeaderModal title={`Opções para ${clubeNome} e ${teamId}`} heading='Escolha uma ação' />
              <form className='mt-4 space-y-4'>    
                
                <div className='flex flex-wrap justify-center gap-2'>
                  <button className='text-white py-2 px-4 rounded w-full sm:w-1/2' style={{
                    backgroundColor: '#1A97F5'}}>Gerar Carteirinha</button>
                  <button className='text-white py-2 px-4 rounded w-full sm:w-1/2' style={{
                    backgroundColor: '#03C9D7'}}>Solicitar Transferência</button>
                  <div className='w-full' aria-hidden='true'></div>
                  <button className='text-white py-2 px-4 rounded w-full sm:w-1/2' style={{
                    backgroundColor: '#FF5C8E'}}>Demitir Atleta</button>
                  <button className='text-white py-2 px-4 rounded w-full sm:w-1/2' style={{
                    backgroundColor: '#7352FF'}}>Inscrever em Campeonato</button>
                  <div className='w-full' aria-hidden='true'></div>
                  <button className='text-white py-2 px-4 rounded w-full sm:w-1/2' style={{
                    backgroundColor: '#FB9678'}}>Estatísticas</button>
                  <div className='w-full' aria-hidden='true'></div>
                </div>    
                
              </form>
            </div>
          </div>
        </div>
      );
    };
    
export default ModalClubeOpcoes;