import HeaderSignup from "../components/HeaderSignup";
import Signup from "../components/Signup";
import maracana from '../img/maracana.jpg';
import logoZsul from '../img/logo_zsul.png';

export default function SignupPage(){
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

  return (
    <div style={backgroundStyle}>
      <div style={boxStyle}>
        <HeaderSignup
          logo={logoZsul}
          title="ZSUL ESPORTES"
          heading="Cadastre-se"
          paragraph="Já possui uma conta? "
          linkName="Cadastre-se"
          linkUrl="/signup"
        />
        <Signup />
      </div>
    </div>
  );
};


