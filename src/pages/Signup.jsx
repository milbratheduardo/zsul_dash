import HeaderSignup from "../components/HeaderSignup";
import Signup from "../components/Signup";

export default function SignupPage(){
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <HeaderSignup
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