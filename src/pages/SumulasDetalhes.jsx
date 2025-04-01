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
import { format } from 'date-fns';

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
  const [selectedStatus, setSelectedStatus] = useState('');


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

  const handleStatusChange = async (atleta, newStatus) => {
    try {
      const idSumula = atleta._id; // já é o ID correto da entrada na sumula
  
      const responsePatch = await fetch(`${process.env.REACT_APP_API_URL}sumula/${idSumula}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field: 'status', value: newStatus }),
      });
  
      if (!responsePatch.ok) {
        throw new Error('Erro ao atualizar o status do atleta');
      }
  
      const updatedAtletas = atletas.map((a) => {
        if (a._id === atleta._id) {
          return { ...a, status: newStatus };
        }
        return a;
      });
  
      setAtletas(updatedAtletas);
      window.location.reload(); // ou remova isso se não for necessário
    } catch (error) {
      console.error('Erro ao atualizar o status do atleta:', error);
    }
  };
  

  
  console.log("Atleta: ", atletas)
  useEffect(() => {
    const fetchCampeonato = async () => {
      try {
        const response = await fetch(` ${process.env.REACT_APP_API_URL}campeonatos/${id}`);
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
        const response = await fetch(` ${process.env.REACT_APP_API_URL}users/${teamId}`);
       
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
    const fetchAtletasFromSumula = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}sumula/team/${teamId}`);
        const data = await response.json();
        console.log('Dados Sumula: ', data);
  
        const atletasFiltrados = data.data.filter(atleta => atleta.campeonatoId === id);
        setAtletas(atletasFiltrados);
      } catch (error) {
        console.error("Erro ao buscar atletas da súmula:", error);
      }
    };
  
    if (teamId && id) {
      fetchAtletasFromSumula();
    }
  }, [teamId, id]);

  const formatCPF = (cpf) => {
    if (typeof cpf === 'string') {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf || ''; 
  };

  const atletasGrid = [
    {
      headerText: 'Foto',
      template: () => (
        <div className='text-center'>
          <img
            src="https://via.placeholder.com/50x50?text=Sem+Foto"
            alt="Foto Atleta"
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
        </div>
      ),
      textAlign: 'Center',
      width: '100'
    },    
    {
      field: 'elencoName',
      headerText: 'Atleta',
      width: '150',
      textAlign: 'Center',
      template: (atleta) => (
        <a href="#" onClick={(e) => e.preventDefault()}>{atleta.elencoName}</a>
      )
    },
    {
      field: 'elencoDocumento',
      headerText: 'Documento',
      width: '150',
      textAlign: 'Center',
      template: (props) => <span>{formatCPF(props.elencoDocumento)}</span>,
    },
    {
      field: 'status',
      headerText: 'Status',
      width: '150',
      textAlign: 'Center',
      template: (atleta) => (
        <select
          value={atleta.status}
          onChange={(e) => handleStatusChange(atleta, e.target.value)}
        >
          <option value="ativo">Ativo</option>
          <option value="banco">{atleta.status === 'banco' ? 'Fora da Súmula' : 'Banco'}</option>
        </select>
      ),
    }    
  ];

  const generatePDF = () => {
    const atletasAtivo = atletas.filter((atleta) => atleta.status === "ativo");
    const today = format(new Date(), "dd/MM/yyyy");

    if (!atletasAtivo || atletasAtivo.length === 0 || atletasAtivo.length > 30) {
      toast.error("Quantidade de Atletas Incompatíveis para Gerar a Súmula.");
      return;
    }
  
    const doc = new jsPDF();
    
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

    doc.setFontSize(20);
    doc.text("X", teamNameXPosition, 60, 'center');

    doc.setFontSize(12);
    doc.text("Data", 195, 20, 'right');
    doc.setFontSize(12);
    doc.text(today, 200, 30, 'right');
  
    
    doc.setFontSize(16);
    const atletasTitle = "Atletas";
    doc.text(atletasTitle, teamNameXPosition, 75, 'center'); 
  
    
    const tableColumn = ["Nº","Nome", "Documento", "Categoria", "Gols", "C.Vermelho"]; 
    
    const tableRows = atletasAtivo.map(atleta => [
      "",
      atleta.name,
      atleta.RG || atleta.CPF, 
      `Sub-${atleta.category}`,
      "",
      "",
    ]);
  
    // Add the table to the PDF
    doc.autoTable(tableColumn, tableRows, { startY: 80 }); 
    const spacingAfterTable = 10;
    const positionAfterTable = doc.lastAutoTable.finalY + spacingAfterTable;

    doc.setFontSize(16);
    const assinaturaTitle = "Assinaturas C.Técnica";
    doc.text(assinaturaTitle, teamNameXPosition, positionAfterTable, 'center');

    doc.setFontSize(12);
    const assinaturaM1 = "Assinatura C.Técnica 1";
    doc.text(assinaturaM1, 40, positionAfterTable + 10, 'center');

    doc.setFontSize(12);
    const assinaturaM2 = "Assinatura C.Técnica 2";
    doc.text(assinaturaM2, teamNameXPosition, positionAfterTable + 10, 'center');

    doc.setFontSize(12);
    const assinaturaM3 = "Assinatura C.Técnica 3";
    doc.text(assinaturaM3, 170, positionAfterTable + 10, 'center');

    // Open the PDF in a new browser tab
    doc.output('dataurlnewwindow');
  };

  const atletasAtivo = atletas.filter((atleta) => atleta.status === "ativo");
  const quantidadeAtletasAtivos = atletasAtivo.length;

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
                <Header category='Súmula' title={`Elenco do ${campeonato.name}`} subtitle={`(${quantidadeAtletasAtivos} atletas ativos)`}/>
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
