import { useState } from 'react';
import { loginFields } from "../constants/formFields";
import Input from "./Input";
import LoginAction from './LoginAction';
import FormExtra from './FormExtra';
import { useNavigate } from 'react-router-dom';



const fields = loginFields;
let fieldsState = {};
fields.forEach(field => fieldsState[field.id] = '');

const LoginComponent = () => {
  const [loginState, setLoginState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  }

  const authenticateUser = async () => {
    try {
      const response = await fetch("http://0.tcp.sa.ngrok.io:12599/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginState.email,
          password: loginState.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('user', JSON.stringify(data)); // Salva todas as informações do usuário
        console.log('Login successful. User ID:', data.data.id); // Exibe o ID do usuário no console
        localStorage.setItem('Login atual', data.data.id); // Grava o ID do usuário no campo "Login atual" no localStorage
        
        // Chama fetchUserData sem passar userId como argumento
        await fetchUserData();
        
        navigate('/home'); 
      } else {
        setErrorMessage(data.message || 'Erro no login');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setErrorMessage('Erro de conexão com o servidor');
    }
  };

  const fetchUserData = async () => {
    // Recupera o ID do usuário armazenado no localStorage sob a chave "Login atual"
    const userId = localStorage.getItem('Login atual');
    if (!userId) {
      console.error('No user ID found in localStorage');
      return;
    }
  
    try {
      const response = await fetch(`http://0.tcp.sa.ngrok.io:12599/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Aqui você precisa substituir 'seuTokenAqui' pelo token de autenticação, se necessário
          // "Authorization": `Bearer ${seuTokenAqui}`
        }
      });
  
      const userData = await response.json();
      if (response.ok) {
        console.log('User data fetched successfully:', userData);
        // Ajuste para acessar o campo permission corretamente, considerando a estrutura de dados
        console.log('User permission:', userData.data.permission); // Exibe a permissão do usuário no console
        localStorage.setItem('permissao', userData.data.permission); // Salva a permissão do usuário no localStorage
      } else {
        console.error('Erro ao buscar dados do usuário:', userData.message);
      }
    } catch (error) {
      console.error('Erro na conexão ao buscar dados do usuário:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateUser();
  };
  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {errorMessage && 
          <div 
            style={{
              backgroundColor: 'red', 
              color: 'white',         
              padding: '10px',       
              borderRadius: '5px',    
              textAlign: 'center',    
              marginBottom: '10px'    
            }}
          >
            {errorMessage}
          </div>
        }
      <div className="-space-y-px">
        {fields.map(field => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={loginState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
      </div>
      <LoginAction text='Login'/>
    </form>
  );
};

export default LoginComponent;
