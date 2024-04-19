import React, {useEffect, useState} from 'react';
import { Header, ModalAtletasOpcoesSumulas } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { GridComponent, ColumnsDirective, ColumnDirective,
  Page, Search, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings, Button } from '../components';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';


const ControleAtletas = () => {
  const { activeMenu, themeSettings, setThemeSettings, 
    currentColor, currentMode } = useStateContext();
  
    const [campeonatos, setCampeonatos] = useState([]);
    const [selectedCampeonatoId, setSelectedCampeonatoId] = useState('');
    const [inscricoes, setInscricoes] = useState([]);
    const [clubes, setClubes] = useState([]);
    const [selectedClubeId, setSelectedClubeId] = useState('');
    const [totalInscricoes, setTotalInscricoes] = useState(0);
    const [showAtletasOpcoes, setShowAtletasOpcoes] = useState(false);
    const [selectedAtleta, setSelectedAtleta] = useState(null);
    const [clubInfo, setClubInfo] = useState({});
    const [campeonatoName, setCampeonatoName] = useState('');


    const [selectedAtletaData, setSelectedAtletaData] = useState({
      name: '',
    });

    const handleAtletaClick = (inscricao) => {
      console.log('Dados do Atleta:', inscricao);       
      const atletaDados = {
        Nome: inscricao.elencoName,
        Id:inscricao.elencoId
      };
      setSelectedAtletaData({
        name: inscricao.elencoName,
        id: inscricao.elencoId,
        documento: inscricao.elencoDocumento,
        status: inscricao.status
      });
      setShowAtletasOpcoes(true);
      setSelectedAtleta(inscricao);
      console.log(atletaDados)
      localStorage.setItem('selectedAtletaId', inscricao._id);
    };

    useEffect(() => {
      const fetchCampeonatos = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}campeonatos/`);
          const data = await response.json();
          console.log('Campeonatos: ', data);
          setCampeonatos(data.data); 
        } catch (error) {
          console.error("Erro ao buscar campeonatos:", error);
        }
      };
  
      fetchCampeonatos();
    }, []);

    useEffect(() => {
      const fetchInscricoes = async () => {
        if (selectedCampeonatoId) {
          try {
            const response = await fetch(` ${process.env.REACT_APP_API_URL}inscricoes/campeonato/${selectedCampeonatoId}`);
            const data = await response.json();
            setInscricoes(data.data);
          } catch (error) {
            console.error("Erro ao buscar inscrições:", error);
          }
        }
      };
  
      fetchInscricoes();
    }, [selectedCampeonatoId]);

    const handleCampeonatoChange = (event) => {
      setSelectedCampeonatoId(event.target.value);
    };

    useEffect(() => {
      const fetchClubes = async () => {
        if (selectedCampeonatoId) {
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}inscricoes/campeonato/${selectedCampeonatoId}`);
            const data = await response.json();
            setClubes(data.data); 
          } catch (error) {
            console.error("Erro ao buscar clubes:", error);
          }
        } else {
          setClubes([]); 
        }
      };
  
      fetchClubes();
    }, [selectedCampeonatoId]); 
  
    const handleClubeChange = (event) => {
      setSelectedClubeId(event.target.value);
    };


    useEffect(() => {
      const fetchSumulas = async () => {
        if (selectedClubeId && selectedCampeonatoId) {
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}sumula/team/${selectedClubeId}`);
            const data = await response.json();
            const sumulasFiltradas = data.data.filter(sumula => sumula.campeonatoId === selectedCampeonatoId);
        
            const inscricoesWithCategory = await Promise.all(sumulasFiltradas.map(async (sumula) => {
              const response = await fetch(`${process.env.REACT_APP_API_URL}elenco/${sumula.elencoId}`);
              const elencoData = await response.json();
              if (elencoData.status === 200 && elencoData.data && elencoData.data.length > 0 && elencoData.data[0] !== null) {
                return {...sumula, category: elencoData.data[0].category};
              } else {
                console.error('Incomplete or null data for elencoId:', sumula.elencoId, elencoData);
                return null; 
              }
            }));
    
            const validInscricoes = inscricoesWithCategory.filter(inscricao => inscricao !== null); // Filter out null entries
            setInscricoes(validInscricoes);
            setTotalInscricoes(validInscricoes.length * 35);
          } catch (error) {
            console.error("Erro ao buscar súmulas:", error);
            setInscricoes([]); 
          }
        } else {
          setInscricoes([]); 
        }
      };
    
      fetchSumulas();
    }, [selectedClubeId, selectedCampeonatoId]);
    
    
    
    

    console.log('Jogadores: ', inscricoes)

    const exportList = async () => {
      if (!selectedCampeonatoId || !selectedClubeId) {
        toast.error("Selecione um campeonato e um clube antes de exportar a lista.");
        return;
      }
      
      const requestBody = {
        teamId: selectedClubeId,
        campeonatoId: selectedCampeonatoId
      };
    
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}sumula/export/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
    
        if (response.ok) {
          toast.success("Lista exportada com sucesso!");
        } else {
          throw new Error('Falha ao exportar a lista.');
        }
      } catch (error) {
        console.error("Erro ao exportar a lista:", error);
        toast.error(error.message);
      }
    };


    const generatePDF = () => {
      const doc = new jsPDF();
      
      
      if (clubInfo.data.pictureBase64) {
        doc.addImage(clubInfo.data.pictureBase64, 'PNG', 10, 0, 50, 50);
      } else {
        console.error("A imagem base64 está null.");
      }
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const teamName = clubInfo.data.teamName || "Equipe"; 
      const teamNameXPosition = (pageWidth / 2);
      
      doc.setFontSize(20);
      doc.text(teamName, teamNameXPosition, 30, 'center');
      doc.setFontSize(16);
      doc.text(campeonatoName, teamNameXPosition, 50, 'center');
      doc.setFontSize(12);
      doc.text("Data", 195, 20, 'right');
      doc.text(new Date().toLocaleDateString(), 200, 30, 'right');
      
      doc.setFontSize(16);
      doc.text("Atletas", teamNameXPosition, 75, 'center');
    
      const tableColumn = ["Nome", "Documento", "Categoria"];
      const tableRows = inscricoes.map((atleta) => [
        atleta.elencoName,
        atleta.elencoDocumento,
        `Sub-${atleta.category}`
      ]);
      
      
      doc.autoTable(tableColumn, tableRows, { startY: 80 }); 
    
      
      doc.save('lista_atletas.pdf');
    };
    

    useEffect(() => {
      const fetchClubInfo = async () => {
        if (selectedClubeId) {
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}users/${selectedClubeId}`);
            const data = await response.json();
            setClubInfo(data);
          } catch (error) {
            console.error("Erro ao buscar informações do clube:", error);
            setClubInfo({});
          }
        }
      };
    
      fetchClubInfo();
    }, [selectedClubeId]);


    useEffect(() => {
      const fetchCampeonato = async () => {
        if (selectedCampeonatoId) {
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}campeonatos/${selectedCampeonatoId}`);
            const data = await response.json();
            setCampeonatoName(data.data.name); 
          } catch (error) {
            console.error("Erro ao buscar dados do campeonato:", error);
            setCampeonatoName(''); 
          }
        } else {
          setCampeonatoName('');
        }
      };
    
      fetchCampeonato();
    }, [selectedCampeonatoId]);
    
    

    const ControleGrid = [
      {
        headerText: 'Foto',
        template: ({ fotoAtletaBase64 } = {}) => ( 
        <div className='text-center'>
          {fotoAtletaBase64 ? 
            <img src={fotoAtletaBase64} alt="Foto Atleta" style={{ width: '50px', height: '50px', borderRadius: '50%' }} /> :
            <span>Sem foto</span> 
          }
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
        template: (inscricao) => (
             <a href="#" onClick={(e) => {
              e.preventDefault();
              handleAtletaClick(inscricao); 
            }}>{inscricao.elencoName}</a>
        )
      },
      { field: 'category', 
        headerText: 'Categoria', 
        width: '150', 
        textAlign: 'Center', 
        template:(inscricao) => (<a>Sub-{inscricao.category}</a>)},
      {
        field: 'elencoDocumento',
        headerText: 'Documento',
        width: '150',
        textAlign: 'Center',
      },
      {
        field: 'status',
        headerText: 'Status',
        width: '150',
        textAlign: 'Center',
      },
    ];

    
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
            isVisible={showAtletasOpcoes} 
            atleta={selectedAtletaData}
            currentColor={currentColor}
            campeonatoId = {selectedCampeonatoId}            
            teamId={selectedClubeId}
            onClose={() => {
              setShowAtletasOpcoes(false);
            }} 
          />

          {!showAtletasOpcoes && (
            <div className='m-2 md:m-10 mt-24 p-2 
            md:p-10 bg-white rounded-3xl'>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Header category="Administrador" title="Controle de Atletas" 
                  subtitle={`(Valor a ser Pago pela Equipe: R$ ${totalInscricoes})||(Número de Atletas na Súmula: ${inscricoes.length})`}/>
                  <Button 
                    color='white'
                    bgColor={currentColor}
                    text='Exportar Lista'
                    borderRadius='10px'
                    size='md'
                    onClick={generatePDF}
                    
                  />
              </div>
              <select onChange={handleCampeonatoChange} value={selectedCampeonatoId} className='mb-4'>
                <option value=''>Selecione um campeonato</option>
                {campeonatos.map((campeonato) => (
                  <option key={campeonato._id} value={campeonato._id}>{campeonato.name}</option>
                ))}
              </select>

              <select onChange={handleClubeChange} value={selectedClubeId} className='mb-4'>
                <option value=''>Selecione um clube</option>
                {clubes.map((clube) => (
                  <option key={clube.userId} value={clube.userId}>{clube.userName}</option>
                ))}
              </select>
              <GridComponent
                 dataSource={selectedClubeId && selectedCampeonatoId && inscricoes ? inscricoes : []}
                allowPaging
                allowSorting
                toolbar={['Search']}
                width='auto'
              >
                <ColumnsDirective>
                  {ControleGrid.map((item, index) => (
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
  )
}

export default ControleAtletas