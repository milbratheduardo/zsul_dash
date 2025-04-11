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
  Estatísticas, ClubesElenco, Permissoes, Punicoes, CamposTecnicos, Blog, Campeonatos_lp,
  CampeonatoDetalhes_lp,
  Estatísticas_lp,
  Punicoes_lp, Atletas_lp, ExternalRedirect} from './pages';
import Recovery from './pages/recovery'


import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Cabecalho } from './components';
import { useNavigate } from 'react-router-dom';



const App = () => {  
    return (
        <BrowserRouter basename="/dash">
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
              <Route path='/campeonatos_lp' element={<Campeonatos_lp />} />
              <Route path="/campeonatos/:id" element={<CampeonatoDetalhes />} />
              <Route path="/campeonatos_lp/:id" element={<CampeonatoDetalhes_lp />} />
              <Route path="/estatísticas" element={<Estatísticas />} />
              <Route path="/estatisticas_lp" element={<Estatísticas_lp />} />
              <Route path="/punicoes" element={<Punicoes />} />
              <Route path="/punicoes_lp" element={<Punicoes_lp />} />
              <Route path="/atletas_lp" element={<Atletas_lp />} />
              <Route path="/camposTecnicos" element={<CamposTecnicos />} />
              {/* Administração */}
              <Route path='/calendario' element={<ExternalRedirect />} />
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