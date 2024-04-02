import React, { useState } from "react";
import '../css/Recovery.css'
import maracana from '../img/maracana.jpg'
import logoZsul from '../img/logo_zsul.png';
import axios from 'axios';

const Recovery = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Chamar a API para enviar email de recuperação de senha
    alert("Email de recuperação de senha enviado para " + email);
  };

  const handleGetPassword = async () => {
    try {
      const response = await axios.get(`https://zsul-api.onrender.com/users/recuperar/${email}`);
      const userData = response.data.data;
      const userPassword = userData.password;
      console.log('Senha do usuário:', userPassword);
    } catch (error) {
      console.error('Erro ao recuperar senha do usuário:', error);
      if (error.response) {
        console.error('Resposta do servidor:', error.response.data);
      } else if (error.request) {
        console.error('Requisição feita, mas não recebeu resposta:', error.request);
      } else {
        console.error('Erro durante a requisição:', error.message);
      }
    }
  };
  

  const backgroundStyle = {
    backgroundImage: `url(${maracana})`,
    backgroundPosition: 'center', 
    backgroundSize: 'cover', 
    backgroundRepeat: 'no-repeat', 
    height: '100vh', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const boxStyle = {
    maxWidth: '400px', 
    height: '600px',
    width: '100%', 
    padding: '20px', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
    borderRadius: '8px',
    backgroundColor: 'white'
  };

  return (
    <div style={backgroundStyle}>
      <div style={boxStyle}>
        <div className="logo">
          <img src={logoZsul} className="boxStyle" alt="Logo Zsul" />
        </div>
        <h1 className="h1">Recuperar Senha</h1>
        <p>
          Digite o email cadastrado em sua conta para recuperar a senha.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
        <button className="button" onClick={handleGetPassword}>Recuperar Senha</button>
        <div className="links">
          <a href="/">Voltar ao Login</a>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
