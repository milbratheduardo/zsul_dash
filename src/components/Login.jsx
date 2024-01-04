import { useState } from 'react';
import { loginFields } from "../constants/formFields";
import  Input from "./Input";
import LoginAction from './LoginAction';
import FormExtra from './FormExtra';
import { useNavigate } from 'react-router-dom';

const fields=loginFields;
let fieldsState = {};
fields.forEach(field=>fieldsState[field.id]='');

const LoginComponent = () => {
  const [loginState,setLoginState]=useState(fieldsState);
  const navigate = useNavigate();


  const handleChange=(e)=>{
      setLoginState({...loginState,[e.target.id]:e.target.value})
  }

  const handleSubmit=(e)=>{
    e.preventDefault();
    authenticateUser();
  }

  const authenticateUser = async () => {
    try {
      const loginData = {
        email: loginState.email,
        password: loginState.password,
      };
  
      const loginDataJson = JSON.stringify(loginData);
      const url = "http://localhost:3000/users/login";
      console.log(loginState)
  
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: loginDataJson
      })
      
      .then(response => response.json())
      .then(data => {
        console.log(`Data: ${JSON.stringify(data)}`);      
      })
      .catch((error) => {
        console.error(`Fetch error: ${error}`);      
      });
    } catch (error) {
      console.error(`Authentication error: ${error}`);
    }
  };

  return (
    <form className="mt-8 space-y-6">
        <div className="-space-y-px">
            {
              fields.map(field=>
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
                
                )
            }
        </div>      
        <FormExtra />
        <LoginAction handleSubmit={handleSubmit} text='Login'/>
      </form>
  )
}

export default LoginComponent