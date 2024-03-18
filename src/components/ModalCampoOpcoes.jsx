import React, { useState, useEffect } from 'react';
import { ModalCamposFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const initialState = {};
ModalCamposFields.forEach(field => {
  initialState[field.id] = '';
});

const ModalCampoOpcoes = ({ isVisible, onClose, currentColor, campoId }) => {
  if (!isVisible) return null;

  const [modalFieldsState, setModalFieldsState] = useState(initialState);
  const [originalFieldsState, setOriginalFieldsState] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleChange = (e) => setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });

  useEffect(() => {
    const fetchData = async () => {
      if (!campoId || !isVisible) return;
  
      try {
        const response = await fetch(`http://localhost:3000/campos/${campoId}`);
        const data = await response.json();
        if (data && data.data) {
            const loadedData = {
              name: data.data.nome || '',
              cidade: data.data.cidade || '',
              endereco: data.data.endereco || '',
              maps: data.data.linkMaps || '',
            };
            setModalFieldsState(loadedData);
            setOriginalFieldsState(loadedData);
          }
      } catch (error) {
        console.error("Erro ao carregar os dados do estádio:", error);
        toast.error("Erro ao carregar os dados do estádio.");
      }
    };
  
    fetchData();
  }, [campoId, isVisible]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const modifiedFields = Object.entries(modalFieldsState).reduce((acc, [key, value]) => {
        if (value !== originalFieldsState[key]) {
          acc[key] = value;
        }
        return acc;
      }, {});

    const formData = new FormData();
    Object.entries(modalFieldsState).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const fileField = document.querySelector("input[type='file']");
    if (fileField && fileField.files.length > 0) {
      formData.append('file', fileField.files[0]);
    }

    const updateField = async (fieldKey, fieldValue) => {
        const formData = new FormData();
        formData.append(fieldKey, fieldValue);
      
        try {
          const response = await fetch(`http://localhost:3000/campos/${campoId}`, {
            method: 'PATCH',
            body: formData,
          });
      
          if (!response.ok) throw new Error('Falha na atualização');
      
          
        } catch (error) {
          console.error(`Erro ao atualizar campo ${fieldKey}:`, error);
          
        }
      };
      
      Object.entries(modifiedFields).forEach(([key, value]) => {
        updateField(key, value);
      });
      
      toast.success('Estádio atualizado com sucesso!', {
        onClose: () => navigate(`/campos`)
      });
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
      <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
        <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
          X
        </button>
        <div className='bg-white p-2 rounded' style={{maxHeight: '100%', overflowY: 'auto'}}>
          <HeaderModal title='Atualizar Estádio' heading='Preencha todos os dados' />
          <form className='mt-4 space-y-4' onSubmit={handleSubmit}>
            {errorMessage && <div style={{backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px', textAlign: 'center', marginBottom: '10px'}}>{errorMessage}</div>}
            <div className='-space-y-px'>
              {ModalCamposFields.map((field, index) => (
                <Input
                  key={field.id}
                  handleChange={handleChange}
                  value={modalFieldsState[field.id]}
                  {...field}
                />
              ))}
            </div>
            <FormAction currentColor={currentColor} text='Atualizar' />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalCampoOpcoes;
