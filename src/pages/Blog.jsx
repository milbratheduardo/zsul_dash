import React, { useEffect, useState } from 'react';
import { Header, Button, Sidebar, Navbar, ThemeSettings, ModalAdicionarPost, ModalAdicionarFoto, CardBlog, CardFoto } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import chroma from 'chroma-js';
import 'swiper/css';

const Blog = () => {
  const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
  const [errorMessage, setErrorMessage] = useState("");
  const permissao = localStorage.getItem('permissao') || '';
  const [showModalAdicionarPost, setShowModalAdicionarPost] = useState(false);
  const [showModalAdicionarFoto, setShowModalAdicionarFoto] = useState(false);
  const [posts, setPosts] = useState([]);
  const [fotografos, setFotografos] = useState([]);
  const navigate = useNavigate();
  const endColor = chroma(currentColor).darken(1).css();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}blog/`);
        const data = await response.json();
        console.log('Dados: ', data);
        setPosts(data.data); 
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchFotografo = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}fotografo/`);
        const data = await response.json();
        console.log('Dados: ', data);
        setFotografos(data.data); 
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      }
    };

    fetchFotografo();
  }, []);



  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <div className='flex relative dark:bg-main-dark-bg'>
        <div className='fixed right-4 bottom-4' style={{ zIndex: '1000' }}>
          <TooltipComponent content="Opções" position='Top'>
            <button
              type='button'
              className='text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white'
              style={{ background: currentColor, borderRadius: '50%' }}
              onClick={() => setThemeSettings(true)}
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

        <div className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'}`}>
          <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
            <Navbar />
          </div>

          {themeSettings && <ThemeSettings />}

          <ModalAdicionarPost
            isVisible={showModalAdicionarPost} 
            currentColor={currentColor} 
            onClose={() => setShowModalAdicionarPost(false)}
          />

          <ModalAdicionarFoto
            isVisible={showModalAdicionarFoto} 
            currentColor={currentColor}  
            onClose={() => setShowModalAdicionarFoto(false)}
          />

          {!showModalAdicionarFoto && !showModalAdicionarPost && (
            <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
                <div className='flex justify-between items-center'>
                    <Header category='Administrador' title='Blog' />
                    <div>
                    {permissao !== 'TEquipe' && (
                        <div className='flex gap-2'>
                        <Button 
                            color='white'
                            bgColor={currentColor}
                            text='Adicionar Post'
                            borderRadius='10px'
                            size='md'
                            onClick={() => setShowModalAdicionarPost(true)}
                        />
                        <Button 
                            color='white'
                            bgColor={endColor}
                            text='Adicionar Fotógrafo(a)'
                            borderRadius='10px'
                            size='md'
                            onClick={() => setShowModalAdicionarFoto(true)}
                        />
                        </div>
                    )}
                    </div>
                </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {posts.map(post => (
                  <CardBlog
                    key={post._id}
                    image={post.imagem}
                    title={post.titulo}
                    descricao={post.subtitulo}
                    currentColor={currentColor}
                    id={post._id}
                    showViewDetailsButton={true}
                    
                  />
                ))}
                {fotografos.map(fotografo => (
                  <CardFoto
                    key={fotografo._id}
                    image={fotografo.foto}
                    title={fotografo.titulo}
                    descricao={fotografo.nome}
                    instagram={fotografo.instagram}
                    currentColor={currentColor}
                    id={fotografo._id}
                    showViewDetailsButton={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
