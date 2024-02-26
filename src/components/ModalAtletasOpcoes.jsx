import React, { useState, useEffect } from 'react';
import HeaderModal from './HeaderModal';
import chroma from 'chroma-js';
import jsPDF from 'jspdf';
import Logo from '../img/Logo_exemplo.png';
import ModalInscricaoCampeonato from './ModalInscricaoCampeonato';

const ModalAtletasOpcoes = ({ isVisible, onClose, atletaNome, currentColor, atleta, teamId }) => {
    if (!isVisible) return null;

    const startColor2 = chroma(currentColor).brighten(1).css();
    const startColor = chroma(currentColor).brighten(1.5).css(); 
    const endColor = chroma(currentColor).darken(1).css();
    const endColor2 = chroma(currentColor).darken(2).css();
    const [isModalInscricaoOpen, setIsModalInscricaoOpen] = useState(false);
    const [timeInfo, setTimeInfo] = useState({});
    const handleClose = (e) => {
        if (e.target.id === 'wrapper') onClose();
      };

      const handleInscricaoClick = (event) => {
        event.preventDefault(); // Isso previne o comportamento padrão do evento, que é a submissão do formulário
        setIsModalInscricaoOpen(true);
      };

      useEffect(() => {
        const fetchTimeInfo = async () => {
          try {
            const response = await fetch(`http://localhost:3000/users/${teamId}`);
           
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
      const gerarCarteirinhaPDF = () => {
        const { name, dateOfBirth, fotoAtletaBase64, CPF} = atleta; 
      
        if (!name || !dateOfBirth || !fotoAtletaBase64 || !CPF) {
          console.error('Dados incompletos do atleta para gerar a carteirinha.');
          return;
        }
      
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: [100, 60]
        });
      
        // Cores da carteirinha
        const backgroundColor = '#D3D3D3'; 
      
        // Fundo da carteirinha
        doc.setFillColor(backgroundColor);
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
      
       
        doc.addImage(fotoAtletaBase64, 'JPEG', 5, 15, 25, 30); 
        // Posição da logo
        const logoX = 80; 
        const logoY = 2;  
        const logoxx = 35;
        
       
        doc.addImage(Logo, 'PNG', logoX, logoY, 20, 20); 
        doc.setTextColor(0, 0, 0); 
        const textX = logoxx; 
        const textYStart = 28; 
        doc.setFontSize(10);
        doc.text('ZSUL Esportes', 10, 15);
        doc.text(`Nome: ${name}`, textX, textYStart - 5);
        doc.text(`CPF: ${CPF}`, textX, textYStart);
        doc.text(`Clube: ${timeInfo.data.teamName}`, textX, textYStart + 5);
        doc.text(`Data de Nasc.: ${dateOfBirth}`, textX, textYStart + 10);

        doc.save(`Carteirinha-${name}.pdf`);
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
                
                <div className='flex flex-wrap justify-center gap-2'>
                <button
                  className='text-white py-2 px-4 rounded w-full sm:w-1/2'
                  style={{ backgroundColor: startColor }}
                  onClick={() => gerarCarteirinhaPDF(atleta)} 
                >
                  Gerar Carteirinha
                </button>
                  <button className='text-white py-2 px-4 rounded w-full sm:w-1/2' style={{
                    backgroundColor: startColor2}}>Solicitar Transferência</button>
                  <div className='w-full' aria-hidden='true'></div>
                  <button className='text-white py-2 px-4 rounded w-full sm:w-1/2' style={{
                    backgroundColor: currentColor}}>Demitir Atleta</button>
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
                <ModalInscricaoCampeonato
            isVisible={isModalInscricaoOpen}
            onClose={() => setIsModalInscricaoOpen(false)} // Função para fechar o ModalInscricaoCampeonato
          />
              </form>
            </div>
          </div>
        </div>
      );
    };
    
export default ModalAtletasOpcoes;