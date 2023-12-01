import React from 'react';
import { LoginComponent, HeaderLogin } from '../components';

const Login = () => {
  return (
    <div>
      <HeaderLogin 
        title= "ZSUL ESPORTES"
        heading="Faça seu Login"
        paragraph="Ainda não tem uma conta? "
        linkName="Cadastre-se"
        linkUrl="/signup"
      />
      <LoginComponent />
      
    </div>
  )
}

export default Login