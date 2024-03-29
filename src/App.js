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
  Estatísticas, ClubesElenco} from './pages';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Cabecalho } from './components';


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
              
              <Route path='/campeonatos' element={<Campeonatos />} />
              <Route path="/campeonatos/:id" element={<CampeonatoDetalhes />} />
              <Route path="/estatísticas" element={<Estatísticas />} />
              {/* Administração */}
              <Route path='/calendario' element={<Calendario />} />
              <Route path='/sumulas' element={<Sumulas />} />
              <Route path="/sumulas/:id" element={<SumulasDetalhes />} />
              {/* Meu Perfil */}
              <Route path='/perfil' element={<MeuPerfil />} />
              {/* Administrador */}
              <Route path='/transferencias' element={<Transferencias />} />
              <Route path='/clubes' element={<Clubes />} />
              <Route path='/clubes/elenco/:teamId' element={<ClubesElenco />} />
              <Route path='/campos' element={<Campos />} />
              <Route path='/controleAtletas' element={<ControleAtletas />} />
              <Route path='/documentos' element={<Documentos />} />
          </Routes>
               
        </BrowserRouter>
    
  )
}

export default App