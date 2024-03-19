import { useState } from 'react';
import { signupFields } from "../constants/formFields"
import LoginAction from "./LoginAction";
import Input from "./Input";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const fields=signupFields;
let fieldsState={};

fields.forEach(field => fieldsState[field.id]='');


const SignupComponent = () => {
  const [signupState,setSignupState]=useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange=(e)=>setSignupState({...signupState,[e.target.id]:e.target.value});

  const handleSubmit=(e)=>{
    e.preventDefault();
    console.log(signupState)
    createAccount()
  }

  const createAccount = async () => {
    try {
      const response = await fetch(' http://0.tcp.sa.ngrok.io:17723/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupState)
      });
  
      const data = await response.json();
      console.log('Account created:', data);
      if (data.status === 200) {
        toast.success('Conta criada com sucesso!', {
          position: "top-center",
          autoClose: 5000,
          onClose: () => navigate('/') 
        });
      } else if (data.status === 400 || data.status === 500) {
        setErrorMessage(data.msg); 
      } else {
        console.log('Error:', data.msg);
      }
  
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setErrorMessage("Houve um problema ao conectar com o servidor.");
    }
  }

    return(
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
        <div className="">
        {
          fields.map(field=>
            <Input
              key={field.id}
              handleChange={handleChange}
              value={signupState[field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
              mask={field.mask}
            />
                
            )
          }
          <LoginAction handleSubmit={handleSubmit} text="Cadastre-se" />
        </div>

         

      </form>
    )
}

export default SignupComponent