import React, { useEffect, useState} from 'react';
import { Button } from '../components';
import { earningData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings } from '../components';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';


const Home = () => {  
    const { activeMenu, themeSettings, setThemeSettings, 
    currentColor, currentMode } = useStateContext();
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const [userAtletas, setUserAtletas] = useState([]);
    const [userInfo, setUserInfo] = useState({});
const permissao = localStorage.getItem('permissao');
    useEffect(() => {
      const fetchUserInfo = async () => {
        const userId = user.data.id;
        try {
          const response = await fetch(`http://localhost:3000/users/${userId}`);
         
          if (response.ok) {
            const data = await response.json();
            setUserInfo(data);
          } else {
            console.error('Erro ao buscar dados do usuário');
          }
        } catch (error) {
          console.error('Erro na solicitação:', error);
        }
      };
  
      if (user.data.id) {
        fetchUserInfo();
      }
    }, [user.data.id]); 

    const generatePDF = () => {
      const doc = new jsPDF();
      if (!userAtletas.data || userAtletas.data.length === 0) {
        toast.error("Não há atletas cadastrados para gerar o PDF.");
        return; // Interrompe a execução do método
      }
      // Assuming userInfo and userAtletas are accessible here
      const logo = userInfo.data?.pictureBase64; // Base64 string of the logo
      if (logo) {
        doc.addImage(logo, 'PNG', 10, 0, 50, 50);
      } else {
        console.error("A imagem base64 está null.");
        // Você pode adicionar lógica adicional aqui para lidar com a falta da imagem.
      }// Adjust positioning and size as needed
    
      const pageWidth = doc.internal.pageSize.getWidth();
      const teamName = userInfo.data.teamName;
      const teamNameXPosition = (pageWidth / 2);
    
      doc.setFontSize(26);
      doc.text(teamName, teamNameXPosition, 30, 'center'); // Adjust Y position as needed
    
      // Center "Atletas" above the table
      doc.setFontSize(18);
      const atletasTitle = "Atletas";
      doc.text(atletasTitle, teamNameXPosition, 45, 'center'); // Adjust Y position as needed
    
      // Define the table columns
      const tableColumn = ["Nome", "Documento", "Categoria"]; // Add more columns as needed
      // Define the table rows
      const tableRows = userAtletas.data?.map(atleta => [
        atleta.name, // Adjust according to your data structure
        atleta.CPF, // Adjust according to your data structure
        atleta.category// Add more fields as needed
      ]);
    
      // Add the table to the PDF
      doc.autoTable(tableColumn, tableRows, { startY: 50 }); 
    
      
      doc.output('dataurlnewwindow');
    };
    
    const generateUserPDF = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/`);
        if (!response.ok) throw new Error('Erro ao buscar dados dos usuários');
        const result = await response.json(); 
    
 
        if (!result.data || result.data.length === 0) {
          toast.error("Não há dados de usuários disponíveis para gerar o PDF.");
          return;
        }
    
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Informações dos clubes", 105, 20, null, 'center');

        const userDetails = result.data.map(user => [
          user.teamName, 
          user.city,    
          user.state,    
        ]);
    
        doc.autoTable({
          head: [["Nome do Clube", "Cidade", "Estado"]],
          body: userDetails,
          startY: 30,
        });
    
        doc.output('dataurlnewwindow');
        toast.success("PDF de usuários gerado com sucesso!");
      } catch (error) {
        console.error('Erro ao buscar informações dos usuários para PDF:', error);
        toast.error("Erro ao buscar informações dos usuários para o PDF.");
      }
    };

    useEffect(() => {
      const fetchUserAtletas = async () => {
        const userId = user.data.id;
        try {
          const responseAtletas = await fetch(`http://localhost:3000/elenco/team/${userId}`);
  
          if (responseAtletas.ok) {
            const dataAtletas = await responseAtletas.json();
            setUserAtletas(dataAtletas);
          } else {
            console.error('Erro ao buscar atletas do usuário');
          }
        } catch (error) {
          console.error('Erro na solicitação:', error);
        }
      };
  
      if (user.data.id) {
        fetchUserAtletas();
      }
    }, [user.data.id]);


  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <div className='flex relative dark:bg-main-dark-bg'>
        <div className='fixed right-4 bottom-4' style={{ zIndex: '1000' }}>
          <TooltipComponent content="Opções" position='Top'>
            <button
              type='button'
              className='text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white'
              onClick={() => setThemeSettings(true)}
              style={{ background: currentColor, borderRadius: '50%' }}
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>
        {activeMenu ? (
          <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white'>
            <Sidebar />
          </div>
        ) : (
          <div className='w-0 dark:bg-secondary-dark-bg'>
            <Sidebar />
          </div>
        )}
        <div
          className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
            activeMenu ? 'md:ml-72' : 'flex-2'
          }`}
        >
          <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
            <Navbar />
          </div>

          {themeSettings && <ThemeSettings />}

          <div className='mt-12'>
            <div className='flex flex-wrap lg:flex-nowrap justify-center'>
              <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='font-bold text-gray-400'>Número de Atletas</p>
                    <p className='text-2xl'>{userAtletas.data?.length ? userAtletas.data?.length : 'Carregando...'}</p>
                  </div>
                </div>
                <div className='mt-6'>
                {permissao !== 'TEquipe' ? (
                  <Button 
                    color='white' 
                    bgColor={currentColor}
                    text='Downloaddd' 
                    borderRadius='10px' 
                    size='md' 
                    onClick={generatePDF}
                  />
                ) : (
                  <Button 
                  style={{ display: 'none' }} 
                  color='white' 
                  bgColor='#4CAF50' // Cor verde fixa
                  text='Baixar' 
                  borderRadius='10px' 
                  size='md' 
                  onClick={generateUserPDF}
                />
                )}
              </div>

              </div>
              

              <div className='flex m-3 flex-wrap justify-center gap-1 items-center'>
                {earningData.map((item) => (
                  <div key={item.title} className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl'>
                    <button
                      type='button'
                      style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                      className='text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl'
                    >
                      {item.icon}
                    </button>
                    <p className='mt-3'>
                      <span className='text-lg font-semibold'>{item.amount}</span>
                    </p>
                    <p className='text-sm text-gray-400 mt-1'>{item.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex gap-10 flex-wrap justify-center'>
              <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-4 m-3 rounded-2xl md:w-780'>
                <div className='flex justify-between'>
                  <p className='font-semibold text-xl'>Próximas Partidas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
