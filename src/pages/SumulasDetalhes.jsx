import React, { useState, useEffect } from 'react'; 
import { GridComponent, ColumnsDirective, ColumnDirective,
  Page, Search, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { Header, Button, ModalAtletasOpcoesSumulas,  } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings } from '../components';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const SumulasDetalhes = () => {
  const { activeMenu, themeSettings, setThemeSettings, 
    currentColor, currentMode } = useStateContext();
  const [campeonato, setCampeonato] = useState([]);
  const [showAtletasOpcoesSumulas, setShowAtletasOpcoesSumulas] = useState(false);
  const [selectedAtleta, setSelectedAtleta] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [userInfo, setUserInfo] = useState({});
  const teamId = user.data.id || null;
  const [atletas, setAtletas] = useState([]);
  const [atletasIds, setAtletasIds] = useState([]);
  const { id } = useParams();

  const [selectedAtletaData, setSelectedAtletaData] = useState({
    name: '',
    dateOfBirth: '',
    fotoAtletaBase64: '',
    CPF: '',
  });

  const handleAtletaClick = (atleta) => {
    console.log('Dados do Atleta:', atleta); 
    const atletaDados = {
      Nome: atleta.name,
      DataDeNascimento: atleta.dateOfBirth,
      FotoBase64: atleta.fotoAtletaBase64,
      CPF: atleta.CPF,
      Id:atleta._id
    };
    setSelectedAtletaData({
      name: atleta.name,
      dateOfBirth: atleta.dateOfBirth,
      fotoAtletaBase64: atleta.fotoAtletaBase64,
      CPF: atleta.CPF,
    });
    setSelectedAtleta(atleta);
    setShowAtletasOpcoesSumulas(true);
    console.log(atletaDados)
    localStorage.setItem('selectedAtletaId', atleta._id);
    localStorage.setItem('selectedTeamId', teamId); 
  };

  useEffect(() => {
    const fetchCampeonato = async () => {
      try {
        const response = await fetch(`http://localhost:3000/campeonatos/${id}`);
        const data = await response.json();
        console.log('Dados: ', data);
        setCampeonato(data.data); 
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    };

    fetchCampeonato();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${teamId}`);
       
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

  useEffect(() => {
    const fetchAtletasIds = async () => {
      try {
        const response = await fetch(`http://localhost:3000/sumula/team/${teamId}`);
        const data = await response.json();
        console.log('Dados Time: ', data);
  
        const atletasFiltrados = data.data.filter(atleta => atleta.campeonatoId === id);
        
        setAtletasIds(atletasFiltrados); 
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    };
  
    fetchAtletasIds();
  }, [teamId, id]); 
  

  useEffect(() => {
    const fetchAtletas = async () => {
      try {
        if (atletasIds && atletasIds.length > 0) {
          let allAtletas = [];
          for (const elencoId of atletasIds) {
            const response = await fetch(`http://localhost:3000/elenco/${elencoId.elencoId}`);
            if (!response.ok) {
              throw new Error(`Network response was not ok for elencoId ${elencoId.elencoId}`);
            }
            const data = await response.json();
            allAtletas.push(data.data);
          }
  
          
          setAtletas(allAtletas);
          console.log('Atletas: ', allAtletas);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
  
    fetchAtletas();
  }, [atletasIds]);

  const formatCPF = (cpf) => {
    if (typeof cpf === 'string') {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf || ''; 
  };

  const atletasGrid = [
    {
      headerText: 'Foto',
      template: ({ fotoAtletaBase64 }) => (
        <div className='text-center'>
          <img src={fotoAtletaBase64} alt="Foto Atleta" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
        </div>
      ),
      textAlign: 'Center',
      width: '100'
    },
    {
      field: 'name', headerText: 'Atleta', width: '150', textAlign: 'Center', 
      template: (atleta) => ( // Aqui, "atleta" representa o objeto completo do atleta na linha atual
        <a href="#" onClick={(e) => {
          e.preventDefault(); // Prevenir o comportamento padrão do link
          handleAtletaClick(atleta); // Passando o objeto atleta completo
        }}>{atleta.name}</a>
      )
    },
    {
      field: 'CPF',
      headerText: 'Documento',
      width: '150',
      textAlign: 'Center',
      template: (props) => <span>{formatCPF(props.CPF)}</span>,
    },
    { field: 'category', headerText: 'Categoria', width: '150', textAlign: 'Center' },
  ];

  console.log('ATletas: ', atletas)
  const generatePDF = () => {
    const doc = new jsPDF();
    if (!atletas || atletas.length === 0) {
      toast.error("Não há atletas cadastrados para gerar o PDF.");
      return; 
    }
    
    const logo = userInfo.data?.pictureBase64; 
    if (logo) {
      doc.addImage(logo, 'PNG', 10, 0, 50, 50);
    } else {
      console.error("A imagem base64 está null.");
      
    }
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const teamName = userInfo.data.teamName;
    const teamNameXPosition = (pageWidth / 2);
  
    doc.setFontSize(26);
    doc.text(teamName, teamNameXPosition, 30, 'center');
    
    doc.setFontSize(22);
    doc.text(campeonato.name, teamNameXPosition, 40, 'center');
  
    
    doc.setFontSize(16);
    const atletasTitle = "Atletas";
    doc.text(atletasTitle, teamNameXPosition, 50, 'center'); 
  
    
    const tableColumn = ["Nome", "Documento", "Categoria"]; 
    
    const tableRows = atletas.map(atleta => [
      atleta.name, // Adjust according to your data structure
      atleta.CPF, // Adjust according to your data structure
      atleta.category// Add more fields as needed
    ]);
  
    // Add the table to the PDF
    doc.autoTable(tableColumn, tableRows, { startY: 55 }); // Adjust positioning as needed
  
    // Open the PDF in a new browser tab
    doc.output('dataurlnewwindow');
  };


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
          
          <ModalAtletasOpcoesSumulas 
            isVisible={showAtletasOpcoesSumulas} 
            atleta={selectedAtleta}
            atletaNome={selectedAtleta ? selectedAtleta.name : ''}
            currentColor={currentColor}
            teamId = {teamId}
            campeonatoNome={campeonato.name}
            campeonatoId={campeonato._id}
            onClose={() => {
              setShowAtletasOpcoesSumulas(false);
            }} 
          />
          
          {!showAtletasOpcoesSumulas && (
            <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Header category='Súmula' title={`Elenco do ${campeonato.name}`} />
                <Button 
                  color='white'
                  bgColor={currentColor}
                  text='Exportar Lista'
                  borderRadius='10px'
                  size='md'
                  onClick={generatePDF}
                />
              </div>        
             
       
              

              <GridComponent
                dataSource={atletas}
                allowPaging
                allowSorting
                toolbar={['Search']}
                width='auto'
              >
                <ColumnsDirective>
                  {atletasGrid.map((item, index) => (
                    <ColumnDirective key={index} {...item}/>
                  ))}
                </ColumnsDirective>
                <Inject services={[Page, Search, Toolbar]}/>
              </GridComponent>           
              
            </div>
          )}            
          </div>
        </div>
      </div>
  );
}

export default SumulasDetalhes;
