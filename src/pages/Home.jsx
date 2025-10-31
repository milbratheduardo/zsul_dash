import React, { useEffect, useState } from 'react';
import { Button } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings } from '../components';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import { FaCircleCheck, FaHandshakeSimple } from 'react-icons/fa6';
import { IoMdCloseCircle } from 'react-icons/io';


const Home = () => {
  const { activeMenu, themeSettings, setThemeSettings,
    currentColor, currentMode } = useStateContext();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [userAtletas, setUserAtletas] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [earningData, setEarningData] = useState([]);
  const [elencoStatus, setElencoStatus] = useState([]);
  const [hover, setHover] = useState(false);
  const [inscricoes, setInscricoes] = useState([]);

  const permissao = localStorage.getItem('permissao');

  const linkStyle = {
    color: hover ? `${currentColor}` : 'inherit',
    cursor: 'pointer',
  };


  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = user.data.id;
      try {
        const response = await fetch(` ${process.env.REACT_APP_API_URL}users/${userId}`);

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

  console.log('userInfo0000 : ', userInfo.data)
  if (userInfo && userInfo.data && userInfo.data.permission) {
    console.log('Permission:', userInfo.data.permission);
    localStorage.setItem('permissao', userInfo.data.permission);

  }


  useEffect(() => {
    const fetchCampeonatosInscritos = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}inscricoes/`);
        const data = await response.json();
        const inscricoesFiltradas = data.data.filter(inscricao => inscricao.userId === user.data.id);
        setInscricoes(inscricoesFiltradas);
        console.log('Inscrições do Usuário: ', inscricoesFiltradas);
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    };

    fetchCampeonatosInscritos();
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
    const tableRows = userAtletas.data[0]?.map(atleta => [
      atleta.name, // Adjust according to your data structure
      atleta.CPF, // Adjust according to your data structure
      `Sub-${atleta.category}`// Add more fields as needed
    ]);

    // Add the table to the PDF
    doc.autoTable(tableColumn, tableRows, { startY: 50 });


    doc.output('dataurlnewwindow');
  };

  const generateUserPDF = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}users/`);
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
        user.permission
      ]);

      doc.autoTable({
        head: [["Nome do Clube", "Cidade", "Estado", "Tipo de Usuário"]],
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
    const fetchElencoStatus = async () => {
      try {
        const responseElenco = await fetch(` ${process.env.REACT_APP_API_URL}elenco/`);
        console.log("ELENCO: ", responseElenco)

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

    if (user.data.id) {
      fetchElencoStatus();
    }
  }, [user.data.id]);


  useEffect(() => {
    const fetchUserAtletas = async () => {
      const userId = user.data.id;
      try {
        const responseAtletas = await fetch(` ${process.env.REACT_APP_API_URL}elenco/team/${userId}`);

        if (responseAtletas.ok) {
          const dataAtletas = await responseAtletas.json();
          setUserAtletas(dataAtletas.data[0]);
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

  useEffect(() => {
    if (inscricoes.length > 0) {
      const totalVitorias = inscricoes.reduce((acc, inscricao) => acc + (inscricao.vitorias || 0), 0);
      const totalEmpates = inscricoes.reduce((acc, inscricao) => acc + (inscricao.empates || 0), 0);
      const totalDerrotas = inscricoes.reduce((acc, inscricao) => acc + (inscricao.derrotas || 0), 0);

      setEarningData([
        {
          icon: <FaCircleCheck />,
          amount: totalVitorias,
          subtitle: 'Vitórias',
          title: 'Vitórias',
          iconColor: '#52bf90',
          iconBg: '#d9ead3',
          pcColor: 'red-600',
        },
        {
          icon: <FaHandshakeSimple />,
          amount: totalEmpates,
          subtitle: 'Empates',
          title: 'Empates',
          iconColor: 'rgb(255, 244, 229)',
          iconBg: 'rgb(254, 201, 15)',
          pcColor: 'green-600',
        },
        {
          icon: <IoMdCloseCircle />,
          amount: totalDerrotas,
          subtitle: 'Derrotas',
          title: 'Derrotas',
          iconColor: 'rgb(228, 106, 118)',
          iconBg: 'rgb(255, 244, 229)',
          pcColor: 'green-600',
        },
      ]);
    }
  }, [inscricoes]);

  const trocarStatus = async () => {
    if (!elencoStatus[0]?._id) return;

    const novoStatus = elencoStatus[0]?.status === 'ativo' ? 'inativo' : 'ativo';

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}elenco/status/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: novoStatus
        }),
      });

      if (!response.ok) {
        throw new Error('Algo deu errado ao tentar atualizar o status');
      }

      toast.success('Status Atualizado com sucesso!', {
        position: "top-center",
        autoClose: 5000,
        onClose: (() => navigate(`/home`),
          window.location.reload())
      });
    } catch (error) {
      console.error('Erro ao atualizar o status:', error);
    }
  }

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
          className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'
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
                  {permissao !== 'admin' && (
                    <div>
                      <p className='font-bold text-gray-400'>Número de Atletas</p>
                      <p className='text-2xl'>{userAtletas?.length ? userAtletas?.length : '0'}</p>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '-6px' }}>
                  {permissao === 'admin' && (
                    <div>
                      <p className='font-bold text-gray-400'>Usuários || Status Exclusão Elenco</p>

                    </div>
                  )}
                  {permissao !== 'admin' ? (
                    <Button
                      color='white'
                      bgColor={currentColor}
                      text='Download'
                      borderRadius='10px'
                      size='md'
                      onClick={generatePDF}
                    />
                  ) : (

                    <div>
                      <Button
                        color='white'
                        bgColor={currentColor}
                        text='Download'
                        borderRadius='10px'
                        size='md'
                        onClick={generateUserPDF}
                      />

                      <Button
                        color='white'
                        bgColor="purple"
                        text={<span style={{ textTransform: 'capitalize' }}>{elencoStatus[0]?.status}</span>}
                        borderRadius='10px'
                        size='md'
                        onClick={trocarStatus}
                      />
                    </div>

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
            <div className="mt-6 flex items-start gap-2 max-w-4xl mx-auto bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
              <svg
                className="w-6 h-6 mt-1 text-yellow-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
                />
              </svg>
              <span className="text-sm leading-relaxed">
                <strong>Aviso Importante:</strong> Até o dia <strong>20/05</strong>, era permitido realizar inscrições de atletas utilizando qualquer tipo de documento. A partir dessa data, somente o <strong>CPF</strong> passou a ser aceito para novos cadastros. <br /><br />
                No entanto, atletas cadastrados antes dessa alteração com outros documentos, como RG, continuam válidos no sistema. Isso pode ocasionar duplicidade de inscrições caso o mesmo atleta tenha sido registrado anteriormente por uma equipe com RG e, posteriormente, por outra com CPF. <br /><br />
                Como o sistema identifica os atletas apenas pelo número do documento, essa situação pode permitir, inadvertidamente, que um mesmo atleta seja inscrito por dois clubes distintos no mesmo campeonato, o que é vedado. <br /><br />
                Por esse motivo, solicitamos que as equipes mantenham diálogo entre si para evitar conflitos e duplicidades. Agradecemos a compreensão e pedimos desculpas por eventuais transtornos.
              </span>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
