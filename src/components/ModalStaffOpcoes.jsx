import React, { useState } from 'react';
import HeaderModal from './HeaderModal';
import chroma from 'chroma-js';
import { toast } from 'react-toastify';


const ModalStaffOpcoes = ({ isVisible, onClose, staffNome, currentColor }) => {
    if (!isVisible) return null;

    const startColor = chroma(currentColor).brighten(1).css();
    const endColor = chroma(currentColor).darken(1).css();
    


    const handleClose = (e) => {
        if (e.target.id === 'wrapper') onClose();
      };
    
      const handleDeleteStaff = async (e) => {
        e.preventDefault();
        const selectedStaffId = localStorage.getItem('selectedStaffId');
        if (selectedStaffId) {
          try {
            const response = await fetch(` ${process.env.REACT_APP_API_URL}staff/${selectedStaffId}`, {
              method: 'DELETE',
            });
            const data = await response.json();
            if (data.status === 200) {
              toast.success('Staff Demitido com Sucesso!', {
                position: "top-center",
                autoClose: 5000,
                onClose: () => navigate('/staff') 
              });
              console.log('Dados: ', data);
            } else {
              setErrorMessage(data.msg)
              console.error('Erro ao cadastrar campeonato ' + errorMessage);
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
            <div className='bg-white p-2 rounded' style={{maxHeight: '100%', overflowY: 'auto'}}>
              <HeaderModal title={`Opções para ${staffNome}`} heading='Escolha uma ação' />
              <form className='mt-4 space-y-4'>    
                
                <div className='flex flex-wrap justify-center gap-2'>
                  <button className='text-white py-2 px-4 rounded w-full sm:w-1/2' style={{
                    backgroundColor: currentColor}}>Gerar Carteirinha</button>
                  <div className='w-full' aria-hidden='true'></div>
                  <button
                    className='text-white py-2 px-4 rounded w-full sm:w-1/2'
                    style={{ backgroundColor: endColor }}
                    onClick={handleDeleteStaff}
                  >
                    Demitir Staff
                  </button>
                  <div className='w-full' aria-hidden='true'></div>  
                </div>    
                
              </form>
            </div>
          </div>
        </div>
      );
    };
    
export default ModalStaffOpcoes;