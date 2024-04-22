import React, { useState, useEffect } from 'react';
import { ModalPerfilFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

const fields = ModalPerfilFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalPerfil = ({ isVisible, onClose, currentColor, userId }) => {
  if (!isVisible) return null;

  const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
  const [compressedImage, setCompressedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialData, setInitialData] = useState([]);
  const navigate = useNavigate();

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}users/${userId}`);
        const data = await response.json();
        if (data.status === 200 && data.data) {
          setInitialData(data.data);
        } else {
          toast.error('Erro ao buscar perfil');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('An error occurred while fetching user');
      }
    };
    fetchInitialData();
  }, [userId]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    try {
      const compressedFile = await compressImage(file);
      setCompressedImage(compressedFile);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Erro ao processar imagem.');
    }
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.015,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (compressedImage) {
      const formData = new FormData();
      formData.append('file', compressedImage, compressedImage.name);
      formData.append('userId', userId);
      formData.append('userType', 'user');
      formData.append('imageField', 'picture');

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}image/`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          toast.success('Imagem enviada com sucesso!');
          onClose(); // Fechar o modal após sucesso
          window.location.reload();
        } else {
          const data = await response.json();
          throw new Error(data.msg || 'Erro ao enviar imagem.');
        }
      } catch (error) {
        console.error('Erro ao enviar imagem:', error);
        toast.error('Erro ao enviar imagem.');
      }
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50' id='wrapper' onClick={handleClose}>
      <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
        <button className='text-white text-xl place-self-end' onClick={onClose}>X</button>
        <div className='bg-white p-2 rounded' style={{maxHeight: '100%', overflowY: 'auto'}}>
          <HeaderModal title='Edite as Informações do Seu Perfil' heading='Preencha todos os dados' />
          <form className='mt-4 space-y-4' onSubmit={handleSubmit}>
            {errorMessage && 
              <div 
                style={{
                  backgroundColor: 'red', 
                  color: 'white',         
                  padding: '10px',       
                  borderRadius: '5px',    
                  textAlign: 'center',    
                  marginBottom: '10px'    
                }}
              >
                {errorMessage}
              </div>
            }
            <div className='-space-y-px'>
              {fields.some(field => field.type === 'file') && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Mudar Imagem</label>
                  <input type="file" onChange={handleImageChange} className="mt-1 block w-full border border-gray-300 rounded-md text-sm p-2"/>
                </div>
              )}
            </div>
            <FormAction currentColor={currentColor} text='Editar' />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalPerfil;
