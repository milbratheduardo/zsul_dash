import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../css/ModaleditName.css';

const ModalEditName = ({ isVisible, onClose, currentColor, userId }) => {
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!newName.trim()) {
      toast.error('Por favor, insira um nome válido.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('teamName', newName);

      const response = await fetch(`${process.env.REACT_APP_API_URL}users/${userId}`, {
        method: 'PATCH',
        body: formData
      });

      if (response.ok) {
        toast.success('Nome atualizado com sucesso!');
        onClose(); // Fechar o modal após sucesso
      } else {
        const errorData = await response.json();
        toast.error(`Erro ao atualizar nome: ${errorData.message}`);
      }
    } catch (error) {
      toast.error('Falha ao atualizar o nome.');
    }

    setLoading(false);
  };

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50'>
      <div className='bg-white p-4 rounded-lg shadow-lg modal-container' style={{ height: '100%', maxHeight: '300px', width: '400px' }}>
        <h2 className='text-lg font-bold'>Editar Nome</h2>
        <input
          type="text"
          value={newName}
          onChange={e => {
            setNewName(e.target.value);
            console.log('Valor do campo:', e.target.value); // Adicionando console.log
          }}
          className="w-full p-2 border border-gray-300 rounded mt-4"
          placeholder="Digite o novo nome"
        />
        <div className='flex justify-end space-x-2 mt-4'>
          <button onClick={onClose} className='bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded'>
            Cancelar
          </button>
          <button onClick={handleSave} className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded' style={{ backgroundColor: currentColor }}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditName;
