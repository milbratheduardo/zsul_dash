import React, { useState, useEffect } from 'react';
import HeaderModal from './HeaderModal';
import chroma from 'chroma-js';
import jsPDF from 'jspdf';
import Logo from '../img/logo_zsul.png';
import ModalInscricaoCampeonato from './ModalInscricaoCampeonato';
import ModalTransferencia from './ModalTransferencia';
import ModalEditarAtleta from './ModalEditarAtleta';
import ModalEstatisticaAtleta from './ModalEstatisticaAtleta';
import { useNavigate } from 'react-router-dom';
import fundo_carteirinha from '../img/carteirinha.png';
import { toast } from 'react-toastify';

const ModalAtletasOpcoes = ({ isVisible, onClose, atletaNome, currentColor, atleta, teamId }) => {
    if (!isVisible) return null;

    const startColor2 = chroma(currentColor).brighten(1).css();
    const startColor = chroma(currentColor).brighten(1.5).css(); 
    const endColor = chroma(currentColor).darken(1).css();
    const endColor2 = chroma(currentColor).darken(2).css();
    const [errorMessage, setErrorMessage] = useState("")
    const [isModalInscricaoOpen, setIsModalInscricaoOpen] = useState(false);
    const [isModalTransferenciaOpen, setIsModalTransferenciaOpen] = useState(false);
    const [isModalEditarOpen, setIsModalEditarOpen] = useState(false);
    const [isModalEstatisticaOpen, setIsModalEstatisticaOpen] = useState(false);
    const [elencoStatus, setElencoStatus] = useState([]);
    const [timeInfo, setTimeInfo] = useState({});
    const navigate = useNavigate();
    const handleClose = (e) => {
        if (e.target.id === 'wrapper') onClose();
      };

      const handleInscricaoClick = (event) => {
        event.preventDefault(); 
        setIsModalInscricaoOpen(true);
      };

      const handleExcluirClick = async (event) => {
        event.preventDefault();
        const atletaId = atleta._id;
    
        if (elencoStatus[0]?.status === 'ativo') {
            try {
                const sumulaResponse = await fetch(`${process.env.REACT_APP_API_URL}sumula/elenco/${atletaId}`);
                if (!sumulaResponse.ok) {
                    throw new Error('Falha ao buscar registros da súmula.');
                }
    
                const { data } = await sumulaResponse.json();
    
                if (data && data.length > 0) {
                    for (const registro of data) {
                        const deleteResponse = await fetch(`${process.env.REACT_APP_API_URL}sumula/${registro._id}`, {
                            method: 'DELETE',
                        });
    
                        if (!deleteResponse.ok) {
                            throw new Error('Falha ao excluir registro da súmula.');
                        }
                    }
                }
    
                const response = await fetch(`${process.env.REACT_APP_API_URL}elenco/${atletaId}`, {
                    method: 'DELETE',
                });
    
                if (!response.ok) {
                    throw new Error('Falha ao excluir atleta.');
                }
    
                toast.success('Atleta e registros da súmula excluídos com sucesso!', {
                    position: "top-center",
                    autoClose: 5000,
                    onClose: () => {
                        navigate(`/elenco`);
                        window.location.reload();
                    },
                });
    
            } catch (error) {
                console.error('Erro:', error);
                toast.error('Erro ao excluir atleta e registros da súmula.');
            }
        } else {
            toast.error('Não estamos no período de exclusão de atletas!', {
                position: "top-center",
                autoClose: 5000,
                onClose: () => {
                    navigate(`/elenco`);
                    window.location.reload();
                },
            });
        }
    };
    

      const handleEditarClick = (event) => {
        event.preventDefault(); 
        setIsModalEditarOpen(true);
      };

      const handleTransferenciaClick = (event) => {
        event.preventDefault(); 
        setIsModalTransferenciaOpen(true);
      };

      const handleEstatisticaClick = (event) => {
        event.preventDefault(); 
        setIsModalEstatisticaOpen(true);
      };

      useEffect(() => {
        const fetchTimeInfo = async () => {
          try {
            const response = await fetch(` ${process.env.REACT_APP_API_URL}users/${teamId}`);
           
            if (response.ok) {
              const data = await response.json();
              setTimeInfo(data);
            } else {
              console.error('Erro ao buscar dados do usuário');
            }
          } catch (error) {
            console.error('Erro na solicitação:', error);
          }
        };
    
        if (teamId) {
          fetchTimeInfo();
        }
      }, [teamId]);

      console.log('time Info: ', timeInfo)
      const gerarCarteirinhaPDF = (event, atleta) => {
        event.preventDefault()        
        try {
          let { 
            name, 
            dateOfBirth, 
            fotoAtletaBase64, 
            RG, 
            CPF,
            RGFrenteBase64, 
            RGVersoBase64, 
            category 
          } = atleta; 
      
          
          name = name || "Nulo";
          dateOfBirth = dateOfBirth || "Nulo";
          fotoAtletaBase64 = fotoAtletaBase64 || "Nulo";
          RG = RG || "Nulo";
          CPF = CPF || "Nulo";
          RGFrenteBase64 = RGFrenteBase64 || "Nulo";
          RGVersoBase64 = RGVersoBase64 || "Nulo";
          category = category || "Nulo";
      
          
          if (name === "Nulo" || dateOfBirth === "Nulo" || fotoAtletaBase64 === "Nulo"  || RGFrenteBase64 === "Nulo" || RGVersoBase64 === "Nulo") {
            console.error('Dados incompletos do atleta para gerar a carteirinha.');
            toast.error('Dados incompletos do atleta para gerar a carteirinha.');
            return;
          }
      
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: [100, 60]
        });

        function capitalize(text) {
          return text.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
        }

        function ajustarTamanhoFonte(doc, texto, larguraMaxima, tamanhoFonte, tamanhoFonteMinimo) {
          doc.setFontSize(tamanhoFonte);
          let larguraTexto = doc.getTextWidth(texto);
      
          while (larguraTexto > larguraMaxima && tamanhoFonte > tamanhoFonteMinimo) {
            tamanhoFonte--;
            doc.setFontSize(tamanhoFonte);
            larguraTexto = doc.getTextWidth(texto);
          }
      
          return tamanhoFonte; 
        }

        const grassBackgroundBase64 = fundo_carteirinha;
        doc.addImage(grassBackgroundBase64, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
       
        doc.addImage(fotoAtletaBase64, 'JPEG', 5, 18, 30, 30);        
        const larguraCampo = 50;
        let tamanhoFonte = 10; 
        const tamanhoFonteMinimo = 6; 
  
        const textX = 35; 
        const textYStart = 28;
        doc.setFontSize(10);

        const documentoExibido = RG === "Nulo" ? CPF : RG;


        let novoTeamName = '';
        let teamNameAntigo = timeInfo.data?.teamName;

        if (teamNameAntigo != null && teamNameAntigo != undefined && teamNameAntigo.length > 14) {
          const nomeSplit = teamNameAntigo.split(' ');

          if(nomeSplit.length == 1){
            novoTeamName = nomeSplit[0][0] + nomeSplit[0][1] + nomeSplit[0][2] + '.'
            return
          }

          nomeSplit.forEach(nome => {
            novoTeamName += nome[0]
          });
        } else {
          novoTeamName = teamNameAntigo;
        }
        
        doc.setTextColor(0, 0, 0); 
        tamanhoFonte = ajustarTamanhoFonte(doc, name.toUpperCase(), larguraCampo, tamanhoFonte, tamanhoFonteMinimo);
        doc.setFontSize(tamanhoFonte);
        doc.text(capitalize(`${name}`), textX + 8, textYStart - 16);
        tamanhoFonte = ajustarTamanhoFonte(doc, documentoExibido, larguraCampo, tamanhoFonte, tamanhoFonteMinimo);
        doc.setFontSize(tamanhoFonte);
        doc.text(documentoExibido, textX + 6, textYStart - 3);
        tamanhoFonte = ajustarTamanhoFonte(doc, documentoExibido, larguraCampo, tamanhoFonte, tamanhoFonteMinimo);
        doc.setFontSize(tamanhoFonte);
        doc.text(capitalize(`${novoTeamName}`), textX + 35, textYStart - 3);
        tamanhoFonte = ajustarTamanhoFonte(doc, documentoExibido, larguraCampo, tamanhoFonte, tamanhoFonteMinimo);
        doc.setFontSize(tamanhoFonte);
        doc.text(`${dateOfBirth}`, textX + 6, textYStart + 11);
        tamanhoFonte = ajustarTamanhoFonte(doc, documentoExibido, larguraCampo, tamanhoFonte, tamanhoFonteMinimo);
        doc.setFontSize(tamanhoFonte);
        doc.text(capitalize(`Sub-${category}`), textX + 40, textYStart + 11);

        const pdfBlob = doc.output('blob');

        // Criar URL para o Blob
        const pdfUrl = URL.createObjectURL(pdfBlob);
      
        // Abrir em nova aba
        window.open(pdfUrl);
      
        console.log('PDF aberto em uma nova aba com sucesso!');
      } catch(error) {
        console.error('Erro ao gerar carteirinha:', error);
      }
      };

      useEffect(() => {
        const fetchElencoStatus = async () => {
          try {
            const responseElenco = await fetch(` ${process.env.REACT_APP_API_URL}elenco/`);
    
            if (responseElenco.ok) {
              const dataElenco = await responseElenco.json();
              setElencoStatus(dataElenco.data[1]);
            } else {
              console.error('Erro ao buscar status elenco');
            }
          } catch (error) {
            console.error('Erro na solicitação:', error);
          }
        };
    
        
          fetchElencoStatus();
        
      },);
      
    return (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
          <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] flex flex-col' style={{ height: '100%', maxHeight: '600px' }}>
            <button className='text-white text-xl place-self-end' onClick={() => onClose()}>
              X
            </button>
            <div className='bg-white p-2 rounded' style={{maxHeight: '100%', overflowY: 'auto'}}>
              <HeaderModal title={`Opções para ${atletaNome}`} heading='Escolha uma ação' />
              <form className='mt-4 space-y-4'>    
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
                <div className='flex flex-wrap justify-center gap-2'>
                <button
                  className='text-white py-2 px-4 rounded w-full sm:w-1/2'
                  style={{ backgroundColor: startColor }}
                  onClick={(event) => gerarCarteirinhaPDF(event, atleta)} 
                >
                  Gerar Carteirinha
                </button>
                  <button className='text-white py-2 px-4 rounded w-full sm:w-1/2' style={{
                    backgroundColor: startColor2}} onClick={(event) => handleTransferenciaClick(event)}>Solicitar Transferência</button>
                  <div className='w-full' aria-hidden='true'></div>
                  <button className='text-white py-2 px-4 rounded w-full sm:w-1/2' style={{ backgroundColor: currentColor }} onClick={(event) => handleEditarClick(event)}>
                    Editar Atleta
                </button>
                <div className='w-full' aria-hidden='true'></div>
                  {elencoStatus[0]?.status !== 'inativo' && (
                    <button 
                      className='text-white py-2 px-4 rounded w-full sm:w-1/2' 
                      style={{ backgroundColor: 'red' }} 
                      onClick={(event) => handleExcluirClick(event)}
                    >
                      Excluir Atleta
                    </button>
                  )}
                  <button
                    className='text-white py-2 px-4 rounded w-full sm:w-1/2'
                    style={{ backgroundColor: endColor }}
                    onClick={(event) => handleInscricaoClick(event)} 
                  >
                    Inscrever em Campeonato
                  </button>
                  <div className='w-full' aria-hidden='true'></div>
                  <button className='text-white py-2 px-4 rounded w-full sm:w-1/2' style={{
                    backgroundColor: endColor2}} onClick={(event) => handleEstatisticaClick(event)}>Estatísticas</button>
                  <div className='w-full' aria-hidden='true'></div>
                </div>    
              </form>
              <ModalInscricaoCampeonato
                  isVisible={isModalInscricaoOpen}
                  currentColor={currentColor}
                  atletaNome={atletaNome}
                  atletaId={atleta._id}
                  teamId={teamId}
                  onClose={() => setIsModalInscricaoOpen(false)} 
                />

              <ModalTransferencia
                  isVisible={isModalTransferenciaOpen}
                  currentColor={currentColor}
                  atletaNome={atletaNome}
                  atletaId={atleta._id}
                  teamId={teamId}
                  onClose={() => setIsModalTransferenciaOpen(false)} 
                />  

              <ModalEditarAtleta
                  isVisible={isModalEditarOpen}
                  currentColor={currentColor}
                  atletaNome={atletaNome}
                  atletaId={atleta._id}
                  teamId={teamId}
                  onClose={() => setIsModalEditarOpen(false)} 
                />   

              <ModalEstatisticaAtleta
                  isVisible={isModalEstatisticaOpen}
                  currentColor={currentColor}
                  atletaNome={atletaNome}
                  atletaId={atleta._id}
                  teamId={teamId}
                  onClose={() => setIsModalEstatisticaOpen(false)} 
                />   
            </div>
          </div>
        </div>
      );
    };
    
export default ModalAtletasOpcoes;