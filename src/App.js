import React, { useEffect } from 'react';
import PrivateRoute from './pages/PrivateRoute'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Calendario, Campeonatos, ComissaoTecnica, 
    Elenco, Home, MeuPerfil, Sumulas, Login, 
    Signup, CampeonatoDetalhes, Transferencias, Clubes,
  SumulasDetalhes, 
  Campos,
  ControleAtletas,
  Documentos,
  Estatísticas, ClubesElenco, Permissoes, Punicoes, CamposTecnicos, Blog} from './pages';
import Recovery from './pages/recovery'


import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Cabecalho } from './components';
import { useNavigate } from 'react-router-dom';


const ExternalRedirect = ({ to }) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.open(to, '_blank');
    navigate(-1); 
  }, [to, navigate]);

  return null; 
};


const App = () => {  
    return (
        <BrowserRouter>
         <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
          <Cabecalho />
            <Routes>
              {/* Dashboard */}
              <Route path='/' element={<Login/>} />
              <Route path='/signup' element={<Signup/>} />
              <Route path='/home' element={<Home/> } />
              {/* Páginas */}
              <Route path='/elenco' element={
                <PrivateRoute component={Elenco} /> // Use PrivateRoute aqui
              } />
              <Route path='/staff' element={<PrivateRoute component={ComissaoTecnica} />} />
              <Route path='/recuperar' element={<Recovery></Recovery>}></Route>
              <Route path='/campeonatos' element={<Campeonatos />} />
              <Route path="/campeonatos/:id" element={<CampeonatoDetalhes />} />
              <Route path="/estatísticas" element={<Estatísticas />} />
              <Route path="/punicoes" element={<Punicoes />} />
              <Route path="/camposTecnicos" element={<CamposTecnicos />} />
              {/* Administração */}
              <Route path='/calendario' element={<ExternalRedirect to="https://docs.google.com/document/d/1NMkbIosEy2_PvUZT41fafTgEOtKZJSEo_ZME2rXt4Uc/edit?usp=sharing" />} />
              <Route path='/sumulas' element={<Sumulas />} />
              <Route path="/sumulas/:id" element={<SumulasDetalhes />} />
              {/* Meu Perfil */}
              <Route path='/perfil' element={<MeuPerfil />} />
              <Route path='/sair' element={<Login/>} />
              {/* Administrador */}
              <Route path='/transferencias' element={<Transferencias />} />
              <Route path='/clubes' element={<Clubes />} />
              <Route path='/clubes/elenco/:teamId' element={<ClubesElenco />} />
              <Route path='/campos' element={<Campos />} />
              <Route path='/controleAtletas' element={<ControleAtletas />} />
              <Route path='/documentos' element={<Documentos />} />
              <Route path='/permissoes' element={<Permissoes />} />
              <Route path='/blog' element={<Blog />} />
          </Routes>
               
        </BrowserRouter>
    
  )
}

export default App