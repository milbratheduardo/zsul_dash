import React, { useState, useEffect } from 'react';
import HeaderModal from './HeaderModal';
import chroma from 'chroma-js';
import jsPDF from 'jspdf';
import Logo from '../img/logo_zsul.png';
import ModalInscricaoCampeonato from './ModalInscricaoCampeonato';
import ModalTransferencia from './ModalTransferencia';
import ModalEditarAtleta from './ModalEditarAtleta';
import { useNavigate } from 'react-router-dom';
import fundo_carteirinha from '../img/carteirinha.png';

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
    const [timeInfo, setTimeInfo] = useState({});
    const navigate = useNavigate();
    const handleClose = (e) => {
        if (e.target.id === 'wrapper') onClose();
      };

      const handleInscricaoClick = (event) => {
        event.preventDefault(); 
        setIsModalInscricaoOpen(true);
      };

      const handleEditarClick = (event) => {
        event.preventDefault(); 
        setIsModalEditarOpen(true);
      };

      const handleTransferenciaClick = (event) => {
        event.preventDefault(); 
        setIsModalTransferenciaOpen(true);
      };

      useEffect(() => {
        const fetchTimeInfo = async () => {
          try {
            const response = await fetch(` https://zsul-api.onrender.com/users/${teamId}`);
           
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
      const gerarCarteirinhaPDF = (atleta) => {
        const { name, dateOfBirth, fotoAtletaBase64, CPF, RGFrenteBase64, RGVersoBase64, category} = atleta; 
      
        if (!name || !dateOfBirth || !fotoAtletaBase64 || !CPF || !RGFrenteBase64 || !RGVersoBase64) {
          console.error('Dados incompletos do atleta para gerar a carteirinha.');
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

        
        doc.setTextColor(0, 0, 0); 
        tamanhoFonte = ajustarTamanhoFonte(doc, name.toUpperCase(), larguraCampo, tamanhoFonte, tamanhoFonteMinimo);
        doc.setFontSize(tamanhoFonte);
        doc.text(capitalize(`${name}`), textX + 8, textYStart - 16);
        tamanhoFonte = ajustarTamanhoFonte(doc, CPF, larguraCampo, tamanhoFonte, tamanhoFonteMinimo);
        doc.setFontSize(tamanhoFonte);
        doc.text(`${CPF}`, textX + 6, textYStart - 3);
        tamanhoFonte = ajustarTamanhoFonte(doc, CPF, larguraCampo, tamanhoFonte, tamanhoFonteMinimo);
        doc.setFontSize(tamanhoFonte);
        doc.text(capitalize(`${timeInfo.data.teamName}`), textX + 40, textYStart - 3);
        tamanhoFonte = ajustarTamanhoFonte(doc, CPF, larguraCampo, tamanhoFonte, tamanhoFonteMinimo);
        doc.setFontSize(tamanhoFonte);
        doc.text(`${dateOfBirth}`, textX + 6, textYStart + 11);
        tamanhoFonte = ajustarTamanhoFonte(doc, CPF, larguraCampo, tamanhoFonte, tamanhoFonteMinimo);
        doc.setFontSize(tamanhoFonte);
        doc.text(capitalize(`${category}`), textX + 40, textYStart + 11);

        const pdfBlob = doc.output('blob');

        // Criar URL para o Blob
        const pdfUrl = URL.createObjectURL(pdfBlob);
      
        // Abrir em nova aba
        window.open(pdfUrl);
      
        console.log('PDF aberto em uma nova aba com sucesso!');
      };
      
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
                  onClick={() => gerarCarteirinhaPDF(atleta)} 
                >
                  Gerar Carteirinha
                </button>
                  <button className='text-white py-2 px-4 rounded w-full sm:w-1/2' style={{
                    backgroundColor: startColor2}} onClick={(event) => handleTransferenciaClick(event)}>Solicitar Transferência</button>
                  <div className='w-full' aria-hidden='true'></div>
                  <button className='text-white py-2 px-4 rounded w-full sm:w-1/2' style={{ backgroundColor: currentColor }} onClick={(event) => handleEditarClick(event)}>
                    Editar Atleta
                </button>
                  <button
                    className='text-white py-2 px-4 rounded w-full sm:w-1/2'
                    style={{ backgroundColor: endColor }}
                    onClick={(event) => handleInscricaoClick(event)} 
                  >
                    Inscrever em Campeonato
                  </button>
                  <div className='w-full' aria-hidden='true'></div>
                  <button className='text-white py-2 px-4 rounded w-full sm:w-1/2' style={{
                    backgroundColor: endColor2}}>Estatísticas</button>
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
            </div>
          </div>
        </div>
      );
    };
    
export default ModalAtletasOpcoes;