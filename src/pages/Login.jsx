import React from 'react';
import { LoginComponent, HeaderLogin } from '../components';
import maracana from '../img/maracana.jpg';
import logoZsul from '../img/logo_zsul.png';

const Login = () => {
  const backgroundStyle = {
    backgroundImage: `url(${maracana})`,
    backgroundPosition: 'center', 
    backgroundSize: 'cover', 
    backgroundRepeat: 'no-repeat', 
    height: '100vh', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const boxStyle = {
    maxWidth: '400px', 
    width: '100%', 
    padding: '20px', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
    borderRadius: '8px',
    backgroundColor: 'white'
  };

  console.log('DOTENV: ', process.env.REACT_APP_API_URL)

  return (
    <div style={backgroundStyle}>
      <div style={boxStyle}>      
        <HeaderLogin
          logo={logoZsul}
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
