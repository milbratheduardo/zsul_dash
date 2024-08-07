import React, { useState } from 'react';
import { ModalTabelaFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const fields = ModalTabelaFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

const ModalTabela = ({ isVisible, onClose, currentColor }) => {
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

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}link/tabela`);
            const data = await response.json();
            console.log('TESTE: ', data)

            if (data.length === 0) {
                await fetch(`${process.env.REACT_APP_API_URL}link/tabela`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ link: modalFieldsState.link }),
                });
                toast.success("Link cadastrado com sucesso!");
            } else {
                await fetch(`${process.env.REACT_APP_API_URL}link/tabela/66a263ecdef3d463d04cec45`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ field: 'link', value: modalFieldsState.link }),
                });
                toast.success("Link atualizado com sucesso!");
            }
        } catch (error) {
            setErrorMessage("Erro ao salvar os dados. Tente novamente.");
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
            <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
                <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
                    X
                </button>
                <div className='bg-white p-2 rounded' style={{ maxHeight: '100%', overflowY: 'auto' }}>
                    <HeaderModal title='Cadastre novo Link' heading='Preencha todos os dados' />
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

export default ModalTabela;
