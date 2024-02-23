import React from 'react';

const ModalInscricaoCampeonato = ({ isVisible, onClose }) => {
  if (!isVisible) return null;
  const handleCloseClickOutside = (event) => {
    if (event.target.id === 'modalInscricaoWrapper') {
      onClose();
    }
  };

  return (
    <div
      id='modalInscricaoWrapper'
      className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'
      onClick={(event) => {
        if (event.target.id === 'modalInscricaoWrapper') {
          onClose();
        }
      }}
    >  
      <div
        className='relative w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col bg-white p-2 rounded'
        style={{ maxHeight: '600px', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()} 
      >
         <button
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#fff', 
            color: '#000', 
            border: 'none',
            fontSize: '24px', 
            cursor: 'pointer' 
          }}
        >
          X
        </button>
       
        <div className="pt-4 px-4 pb-4"> 
          <h2 className="text-center mb-4">Cadastro em Campeonato</h2>
          
        </div>
      </div>
    </div>
  );
};

export default ModalInscricaoCampeonato;