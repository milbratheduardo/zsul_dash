import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Calendario, Campeonatos, ComissaoTecnica, 
    Elenco, Home, MeuPerfil, Tarefas, Login, Signup, CampeonatoDetalhes } from './pages';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {  
    return (
        <BrowserRouter>
         <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
            <Routes>
              {/* Dashboard */}
              <Route path='/' element={<Login/>} />
              <Route path='/signup' element={<Signup/>} />
              <Route path='/home' element={<Home/> } />
              {/* Páginas */}
              <Route path='/elenco' element={<Elenco/>} />
              <Route path='/staff' element={<ComissaoTecnica />} />
              <Route path='/campeonatos' element={<Campeonatos />} />
              <Route path="/campeonatos/:id" element={<CampeonatoDetalhes />} />
              {/* Administração */}
              <Route path='/calendario' element={<Calendario />} />
              <Route path='/tarefas' element={<Tarefas />} />
              {/* Meu Perfil */}
              <Route path='/perfil' element={<MeuPerfil />} />
          </Routes>
               
        </BrowserRouter>
    
  )
}

export default App