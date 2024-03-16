import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component }) => {
  const permissao = localStorage.getItem('permissao');

  // Se a permissão for "admin", redireciona para a homepage, por exemplo
  // Caso contrário, renderiza o componente passado como prop
  return permissao !== 'TEquipe' ? <Navigate to="/home" /> : <Component />;
};

export default PrivateRoute;