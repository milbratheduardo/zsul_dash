import React, { useState, useEffect } from 'react';
import { ModalCamposFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const fields = ModalCamposFields;
let fieldsState = {
    name: '',
    localizacao: '',
};

fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalEditarCampo = ({ isVisible, onClose, currentColor, campoId }) => {
    if (!isVisible) return null;

    const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
    const [errorMessage, setErrorMessage] = useState("");
    const [initialData, setInitialData] = useState({});
    const navigate = useNavigate();

    const handleClose = (e) => {
        if (e.target.id === 'wrapper') onClose();
    };

    const handleChange = (e) => setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await fetch(`http://0.tcp.sa.ngrok.io:17723/campos/${campoId}`);
                const data = await response.json();
                if (data.status === 200 && data.data) {
                    setInitialData(data.data);
                    setModalFieldsState(data.data);
                } else {
                    toast.error('Failed to fetch campo data');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                toast.error('An error occurred while fetching campo data');
            }
        };
        fetchInitialData();
    }, [campoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const changes = Object.entries(modalFieldsState).reduce((acc, [key, value]) => {
            if (value !== initialData[key]) {
                acc.push({ field: key, value });
            }
            return acc;
        }, []);

        if (changes.length === 0) {
            toast.info('Não houve mudanças!');
            return;
        }

        for (const change of changes) {
            try {
                const response = await fetch(`http://0.tcp.sa.ngrok.io:17723/campos/${campoId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(change)
                });

                const data = await response.json();
                if (response.ok) {
                    toast.success(`Campo ${change.field} editado com sucesso!`, {
                        position: "top-center",
                        autoClose: 5000
                    });
                } else {
                    console.error('Error:', data.message);
                    toast.error(data.message || 'Erro desconhecido.');
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                toast.error("Houve um problema ao conectar com o servidor.");
            }
        }

        navigate(`/campos`);
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
            <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
                <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
                    X
                </button>
                <div className='bg-white p-2 rounded' style={{ maxHeight: '100%', overflowY: 'auto' }}>
                    <HeaderModal title={`Atualizar Campo`} heading='Preencha todos os dados' />
                    <form className='mt-4 space-y-4' onSubmit={handleSubmit}>
                        {errorMessage && 
                            <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px', textAlign: 'center', marginBottom: '10px' }}>
                                {errorMessage}
                            </div>
                        }
                        <div className='-space-y-px'>
                            {fields.map((field, index) => (
                                <Input
                                    key={field.id}
                                    handleChange={handleChange}
                                    value={modalFieldsState[field.id] || ''}
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

export default ModalEditarCampo;
