import React from 'react';
import { LoginComponent, HeaderLogin } from '../components';

const Login = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <HeaderLogin
          title="ZSUL ESPORTES"
          heading="Faça seu Login"
          paragraph="Ainda não tem uma conta? "
          linkName="Cadastre-se"
          linkUrl="/signup"
        />
        <LoginComponent />
      </div>
    </div>
  );
};

export default Login;
