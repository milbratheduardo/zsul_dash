import React, { useState, useEffect } from 'react';
import { ModalSumulaJogoFields } from '../constants/formFields';
import Input from './Input';
import FormAction from './FormAction';
import HeaderModal from './HeaderModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../components';

const fields = ModalSumulaJogoFields;
let fieldsState = {};
fields.forEach(field => (fieldsState[field.id] = ''));

const ModalEstatisticas = ({ isVisible, onClose, currentColor, timeCasa, timeFora, jogoId, campeonatoId, nomeTimeCasa, nomeTimeFora, logoTimeCasa, logoTimeFora }) => {
    if (!isVisible) return null;

    const [modalFieldsState, setModalFieldsState] = useState(fieldsState);
    const [errorMessage, setErrorMessage] = useState("");
    const [atletasTimeCasa, setAtletasTimeCasa] = useState([]);
    const [atletasTimeFora, setAtletasTimeFora] = useState([]);
    const [initialData, setInitialData] = useState([]);
    const [selects, setSelects] = useState([]);
    const [jogoEstatisticas, setJogoEstatisticas] = useState(null);
    const [estatisticasJogadores, setEstatisticasJogadores] = useState([]);
    const navigate = useNavigate();

    const handleClose = e => {
        if (e.target.id === 'wrapper') onClose();
    };

    useEffect(() => {
        const fetchEstatisticasJogo = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}estatistica/jogo/${jogoId}`);
                const data = await response.json();
                console.log('Data: ', data);
                if (data.status === 200 && data.data.length > 0) {
                    const estatisticasJogo = data.data[0];
                    if (estatisticasJogo) {
                        setJogoEstatisticas(estatisticasJogo);
                    } else {
                        console.error('Estatísticas do jogo não encontradas');
                        setJogoEstatisticas(null);
                    }
                } else {
                    console.error('Estatísticas do jogo não encontradas');
                    setJogoEstatisticas(null);
                }
            } catch (error) {
                console.error('Erro ao buscar estatísticas do jogo:', error);
            }
        };

        const fetchEstatisticasJogadores = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}estatistica/jogador/all`);
                const data = await response.json();
                if (data.status === 200) {
                    const filteredData = data.data.filter(estatistica => estatistica.jogoId === jogoId);
                    setEstatisticasJogadores(filteredData);
                } else {
                    console.error('Erro ao buscar estatísticas dos jogadores');
                }
            } catch (error) {
                console.error('Erro ao buscar estatísticas dos jogadores:', error);
            }
        };

        if (jogoId) {
            fetchEstatisticasJogo();
            fetchEstatisticasJogadores();
        }
    }, [jogoId]);

    console.log('JogoId: ', jogoId)

    const renderEstatisticas = (tipo, descricao) => {
        const estatisticasFiltradas = estatisticasJogadores.filter(estatistica => estatistica[tipo] !== '0');
        if (estatisticasFiltradas.length === 0) {
            return <div className="text-lg">Sem {descricao}</div>;
        }
        return estatisticasFiltradas.map(estatistica => (
            <div key={estatistica.id} className="text-sm">
                <span className="font-bold">{estatistica[tipo]}x</span> {estatistica.jogadorName} - {estatistica.teamName}
            </div>
        ));
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
            <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
                <button className='text-white text-xl place-self-end' onClick={onClose}>
                    X
                </button>
                <div className='bg-white p-2 rounded' style={{ maxHeight: '100%', overflowY: 'auto' }}>
                    <HeaderModal title="Veja a Súmula da Partida" />
                    <div className="mt-4 flex flex-col items-center gap-4">
                        <div className="flex justify-center items-center w-full px-6">
                            <div className="flex flex-col items-center">
                                <img alt="Home Team Logo" src={logoTimeCasa} className="h-16 w-16 object-cover" />
                                <p className="text-gray-700 text-base mt-2">
                                    {nomeTimeCasa}
                                </p>
                            </div>

                            <div className="flex items-center mx-2">
                                {jogoEstatisticas ? (
                                    <span className="text-xl font-semibold">{jogoEstatisticas.userCasaGols}</span>
                                ) : (
                                    <span className="text-xl font-semibold">-</span>
                                )}
                                <span className="text-xl font-semibold mx-1">X</span>
                                {jogoEstatisticas ? (
                                    <span className="text-xl font-semibold">{jogoEstatisticas.userForaGols}</span>
                                ) : (
                                    <span className="text-xl font-semibold">-</span>
                                )}
                            </div>

                            <div className="flex flex-col items-center">
                                <img alt="Away Team Logo" src={logoTimeFora} className="h-16 w-16 object-cover" />
                                <p className="text-gray-700 text-base mt-2">
                                    {nomeTimeFora}
                                </p>
                            </div>
                        </div>
                        <>
                            <div className="text-center space-y-2 pb-10">
                                <div className="text-xl font-semibold">Gols:</div>
                                {renderEstatisticas('gols', 'Gols')}
                                <div className="text-xl font-semibold">Cartões Amarelos:</div>
                                {renderEstatisticas('numeroCartoesAmarelo', 'Cartões Amarelos')}
                                <div className="text-xl font-semibold">Cartões Vermelhos:</div>
                                {renderEstatisticas('numeroCartoesVermelho', 'Cartões Vermelhos')}
                            </div>
                        </>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalEstatisticas;
