import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Calendario, Campeonatos, ComissaoTecnica, 
    Elenco, Home, MeuPerfil, Tarefas, Login, Signup } from './pages';
import './App.css';

const App = () => {  
    return (
        <BrowserRouter>
            <Routes>
              {/* Dashboard */}
              <Route path='/' element={<Login/>} />
              <Route path='/signup' element={<Signup/>} />
              <Route path='/home' element={<Home/> } />
              {/* Páginas */}
              <Route path='/elenco' element={<Elenco/>} />
              <Route path='/staff' element={<ComissaoTecnica />} />
              <Route path='/campeonatos' element={<Campeonatos />} />
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