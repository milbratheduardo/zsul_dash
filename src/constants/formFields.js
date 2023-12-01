const loginFields=[
    {
        labelText:"Email",
        labelFor:"email",
        id:"email-address",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email"   
    },
    {
        labelText:"Senha",
        labelFor:"senha",
        id:"senha",
        name:"senha",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Senha"   
    }
]

const signupFields=[
    {
        labelText:"Nome",
        labelFor:"nome",
        id:"nome",
        name:"nome",
        type:"text",
        autoComplete:"nome",
        isRequired:true,
        placeholder:"Nome da Equipe"   
    },
    {
        labelText:"Email",
        labelFor:"email",
        id:"email-address",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email"   
    },
    {
        labelText:"Senha",
        labelFor:"senha",
        id:"senha",
        name:"senha",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Senha"  
    },
    {
        labelText:"Confirm Password",
        labelFor:"confirm-password",
        id:"confirm-password",
        name:"confirm-password",
        type:"password",
        autoComplete:"confirm-password",
        isRequired:true,
        placeholder:"Confirm Password"   
    },
    {
        labelText:"Cidade",
        labelFor:"cidade",
        id:"cidade",
        name:"cidade",
        type:"text",
        autoComplete:"cidade",
        isRequired:true,
        placeholder:"Cidade" 
    },
    {
        labelText:"Estado",
        labelFor:"estado",
        id:"estado",
        name:"estado",
        type:"text",
        autoComplete:"estado",
        isRequired:true,
        placeholder:"Estado" 
    }
]

export {loginFields,signupFields}