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
      const response = await fetch("http://localhost:3000/users/login", {
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
        navigate('/home'); // Altere para a rota desejada após o login
      } else {
        setErrorMessage(data.message || 'Erro no login');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setErrorMessage('Erro de conexão com o servidor');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateUser();
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
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
      <FormExtra />
      <LoginAction text='Login'/>
    </form>
  );
};

export default LoginComponent;
