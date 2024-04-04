import React, { useState } from 'react';
import { ModalCompeticaoFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

const fields = ModalCompeticaoFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalCompeticao = ({ isVisible, onClose, currentColor }) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData = {
            name: modalFieldsState['name'],
            categoria: modalFieldsState['categoria'],
            tipoCompeticao: modalFieldsState['tipoCompeticao'],
            participantes: '0',
            quantidadeGrupos: modalFieldsState['quantidadeGrupos'],
            dataInicio: modalFieldsState['dataInicio'],
            cidade: modalFieldsState['cidade'],
            tipoGrupo: modalFieldsState['tipoGrupo'],
            tipoMataMata: modalFieldsState['tipoMataMata'],
            vagas: modalFieldsState['participantes']
        };

        sendRequest(requestData);
    };

    const sendRequest = async (data) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}campeonatos/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();
            if (response.ok && responseData.data._id) {
                const fileField = document.querySelector("input[type='file']");
                if (fileField && fileField.files[0]) {
                    uploadImage(responseData.data._id, fileField.files[0]);
                } else {
                    toast.success('Campeonato cadastrado com sucesso!', {
                        position: "top-center",
                        autoClose: 5000,
                        onClose: () => navigate('/campeonatos')
                    });
                }
            } else {
                throw new Error(responseData.msg || 'Erro ao cadastrar campeonato');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Houve um problema ao conectar com o servidor.");
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
            });
        }
    };

    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 0.015, 
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };

        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
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

    const uploadImage = async (campeonatoId, file) => {
        compressImage(file).then(compressedFile => {
            convertFileToBase64(compressedFile, async (base64String) => {
                const jsonData = {
                    userId: campeonatoId,
                    file: base64String,
                    fileType: file.type.split('/')[1],
                    userType: 'campeonato',
                    imageField: 'picture',
                };

                console.log('CampeonatoId: ', campeonatoId)
                console.log('CampeonatoId: ', jsonData)

                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}image/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(jsonData),
                    });

                    if (response.ok) {
                        toast.success('Campeonato e imagem associada salvos com sucesso!', {
                            position: "top-center",
                            autoClose: 5000,
                            onClose: () => navigate('/campeonatos')
                        });
                    } else {
                        const data = await response.json();
                        throw new Error(data.msg || 'Erro ao enviar imagem.');
                    }
                } catch (error) {
                    console.error('Erro ao enviar imagem:', error);
                    toast.error('Erro ao enviar imagem.', {
                        position: "top-center",
                        autoClose: 5000,
                    });
                }
            });
        });
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
            <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
                <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
                    X
                </button>
                <div className='bg-white p-2 rounded' style={{ maxHeight: '100%', overflowY: 'auto' }}>
                    <HeaderModal title='Cadastre nova Competição' heading='Preencha todos os dados' />
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
                        {fields.filter(field => field.id !== 'status' && field.id !== 'inscricoesAtletas').map((field, index) => (
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

export default ModalCompeticao;
