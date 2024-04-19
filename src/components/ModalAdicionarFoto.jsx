import React, { useState } from 'react';
import { ModalAdicionarFotoFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

const fields = ModalAdicionarFotoFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalAdicionarFoto = ({ isVisible, onClose, currentColor }) => {
    if (!isVisible) return null;

    const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleClose = (e) => {
        if (e.target.id === 'wrapper') onClose();
    };

    const handleChange = (e) => {
        setModalFieldsState({ ...modalFieldsState, [e.target.id]: e.target.value });
    };

    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 0.015,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };

        try {
            return await imageCompression(file, options);
        } catch (error) {
            console.error(error);
            return file; 
        }
    };

    const convertFileToBase64 = (file, callback) => {
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result.replace(/^data:.+;base64,/, ''));
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fileInput = document.querySelector("input[type='file']");
        const file = fileInput ? fileInput.files[0] : null;

        if (!file) {
            setErrorMessage('Nenhum arquivo selecionado.');
            return;
        }

        const fileExtension = file.name.split('.').pop();

        const postData = {
            titulo: modalFieldsState.titulo,
            instagram: modalFieldsState.instagram,
            nome: modalFieldsState.nome,
            foto: '',
            tipoFoto: fileExtension
        };

        try {
            const compressedImage = await compressImage(file);
            convertFileToBase64(compressedImage, (base64Image) => {
                postData.foto = base64Image;

                fetch(`${process.env.REACT_APP_API_URL}fotografo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData)
                })
                .then(response => response.json())
                .then(data => {
                    toast.success('Foto adicionada com sucesso!', {
                        position: "top-center",
                        autoClose: 5000,
                        onClose: (() => navigate('/blog'),
                        window.location.reload())
                    });
                })
                .catch(error => {
                    console.error('Erro ao enviar o post:', error);
                    setErrorMessage('Falha ao enviar o post.');
                });
            });
        } catch (error) {
            console.error('Erro ao comprimir a imagem:', error);
            setErrorMessage('Falha ao processar a imagem.');
        }
    };  
    

    return (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
            <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
                <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
                    X
                </button>
                <div className='bg-white p-2 rounded' style={{ maxHeight: '100%', overflowY: 'auto' }}>
                    <HeaderModal title='Cadastre nova Foto' heading='Preencha todos os dados' />
                    <form className='mt-4 space-y-4' onSubmit={handleSubmit}>
                        {errorMessage && (
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
                        )}
                        <div className='-space-y-px'>
                        {fields.filter(field => field.id !== 'status' && field.id !== 'inscricoesAtletas' && field.id !== 'vagas').map((field, index) => (
                                <div key={field.id} className={`field-margin ${index !== 0 ? 'mt-2' : ''} ${field.type === 'dropdown' ? 'mb-2' : ''}`}>
                                    {field.type === 'dropdown' ? (
                                        <div>
                                            <select
                                                id={field.id}
                                                name={field.name}
                                                value={modalFieldsState[field.id]}
                                                onChange={handleChange}
                                                className='mt-3 p-2 block w-full border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                                            >
                                                <option value='' disabled>
                                                    {field.placeholder}
                                                </option>
                                                {field.options.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <div>
                                            {field.type === 'file' ? (
                                                <label className='block text-sm font-medium text-gray-700 mt-4 ml-3'>{field.labelText}</label>
                                            ) : null}
                                            <Input
                                                handleChange={handleChange}
                                                value={modalFieldsState[field.id]}
                                                labelText={field.labelText}
                                                labelFor={field.labelFor}
                                                id={field.id}
                                                name={field.name}
                                                type={field.type}
                                                isRequired={field.isRequired}
                                                placeholder={field.placeholder}
                                                mask={field.mask}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <FormAction currentColor={currentColor} text='Cadastrar' />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalAdicionarFoto;
