import React, { useEffect, useState } from 'react';

import { Link, NavLink } from 'react-router-dom';
import { PiSoccerBallFill } from 'react-icons/pi';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { links } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import logoZsul from '../img/logo_zsul.png';
const Sidebar = () => {
  
  const { activeMenu, setActiveMenu, screenSize, currentColor } = useStateContext();
  const [permissao, setPermissao] = useState(localStorage.getItem('permissao'));

  const handleCloseSideBar = () => {
    if(activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  }


  
  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';
  


  useEffect(() => {
    // Função para verificar a permissão
    const verificarPermissao = () => {
      const permissaoAtual = localStorage.getItem('permissao');
      if (permissao !== permissaoAtual) {
        setPermissao(permissaoAtual);
      }
    };

    // Configurando o intervalo para verificar a permissão a cada 1 segundo
    const intervalId = setInterval(verificarPermissao, 1000);

    // Limpando o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, [permissao]);



  
  return (
    <div className='ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10'>
      {activeMenu && (
        <>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%', 
              marginLeft: '-10px'
            }}>
              <Link to="/home" onClick={handleCloseSideBar}>
                <img 
                  src={logoZsul} 
                  alt="Logo" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '180px', 
                    height: 'auto' 
                  }} 
                />
              </Link>
            <TooltipComponent content="Menu" position='BottomCenter'>
              <button type='button' onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}              
              className='text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden'>
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className='mt-10'>
            {links.map((item) => {
              // Se a permissão for 'admin' e o título for 'Administração', não renderiza o item
              if (permissao === 'admin' && item.title === 'Administração') {
                return null;
              }
              if (permissao === 'TEquipe' && item.title === 'Administrador') {
                return null;
              }

              return (
                <div key={item.title}>
                  <p className='text-gray-400 m-3 mt-4 uppercase'>
                    {item.title}
                  </p>
                  {item.links.map((link) => {
                    // Condições existentes para não renderizar certos links com base na permissão
                    if (permissao === 'admin' && (link.name === 'elenco' || link.name === 'staff' || link.name === 'calendario' 
                    || link.name === 'Sumulas' || link.name === 'camposTecnicos')) {
                      return null;
                    }

                    if (permissao === 'TEquipe' && (link.name === 'Transferencias' || link.name === 'Clubes' || link.name === 'Campos' || link.name === 'ControleAtletas' 
                      || link.name === 'Documentos' || link.name === 'Permissoes' || link.name === 'Blog')) {
                      return null;
                    }

                    // Renderiza o NavLink se as condições acima não forem verdadeiras
                    return (
                      <NavLink
                        to={`/${link.name}`}
                        key={link.name}
                        onClick={handleCloseSideBar}
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? currentColor : ''
                        })}
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                      >
                        {link.icon}
                        <span className='capitalize'>
                          {link.name === 'staff' ? 'Comissão Técnica' : 
                          link.name === 'ControleAtletas' ? 'Controle de Atletas' :
                          link.name === 'punicoes' ? 'Punições' : 
                          link.name === 'Clubes' ? 'Usuários' : 
                          link.name === 'camposTecnicos' ? 'Campos' : link.name}
                        </span>
                      </NavLink>
                    );
                  })}
                </div>
              );
            })}
          </div>

        </>
      )}
    </div>
  )
}

export default Sidebar