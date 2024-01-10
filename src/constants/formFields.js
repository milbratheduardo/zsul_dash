const loginFields=[
    {
        labelText:"Email",
        labelFor:"email",
        id:"email",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email"   
    },
    {
        labelText:"Senha",
        labelFor:"senha",
        id:"password",
        name:"password",
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
        id:"teamName",
        name:"teamName",
        type:"text",
        autoComplete:"nome",
        isRequired:true,
        placeholder:"Nome da Equipe"   
    },
    {
        labelText:"Email",
        labelFor:"email",
        id:"email",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email"   
    },
    {
        labelText:"Senha",
        labelFor:"password",
        id:"password",
        name:"senha",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Senha"  
    },
    {
        labelText:"Confirme a Senha",
        labelFor:"confirmPassword",
        id:"confirmPassword",
        name:"confirm-password",
        type:"password",
        autoComplete:"confirm-password",
        isRequired:true,
        placeholder:"Confirme a Senha"   
    },
    {
        labelText:"Cidade",
        labelFor:"cidade",
        id:"city",
        name:"cidade",
        type:"text",
        autoComplete:"cidade",
        isRequired:true,
        placeholder:"Cidade" 
    },
    {
        labelText:"Estado",
        labelFor:"estado",
        id:"state",
        name:"estado",
        type:"text",
        autoComplete:"estado",
        isRequired:true,
        placeholder:"Estado" 
    }
]

const ModalAtletaFields = [
    {
        labelText:"Nome do Atleta",
        labelFor:"nome",
        id:"name",
        name:"name",
        type:"text",
        autoComplete:"nome",
        isRequired:true,
        placeholder:"Nome do Atleta"   
    },
    {
        labelText:"Data de Nascimento",
        labelFor:"nascimento",
        id:"dateOfBirth",
        name:"dateOfBirth",
        type:"text",
        autoComplete:"nascimento",
        isRequired:true,
        placeholder:"Data de Nascimento"   
    },
    {
        labelText:"Documento",
        labelFor:"documento",
        id:"documentNumber",
        name:"documentNumber",
        type:"text",
        autoComplete:"documento",
        isRequired:true,
        placeholder:"RG/CPF"  
    },
    {
        labelText:"Escola",
        labelFor:"escola",
        id:"school",
        name:"school",
        type:"text",
        autoComplete:"escola",
        isRequired:true,
        placeholder:"Escola"  
    },
    {
        labelText: "Categoria",
        labelFor: "categoria",
        id: "category",
        name: "category",
        type: "dropdown",
        isRequired: true,
        options: [
        { value: "sub9", label: "Sub-9" },
        { value: "sub11", label: "Sub-11" },
        { value: "sub13", label: "Sub-13" },
        { value: "sub15", label: "Sub-15" },
        { value: "sub17", label: "Sub-17" },
        ],
        placeholder: "Categoria",
    },
    {
        labelText:"RG Frente",
        labelFor:"rgfrente",
        id:"RGFrente",
        name:"RGFrente",
        type:"file",
        autoComplete:"rgfrente",
        isRequired:false,
        placeholder:"Frente do RG"   
    },
    {
        labelText:"RG Verso",
        labelFor:"rgverso",
        id:"RGVerso",
        name:"RGVerso",
        type:"file",
        autoComplete:"rgverso",
        isRequired:false,
        placeholder:"Verso do RG" 
    },
    {
        labelText:"Foto do Atleta",
        labelFor:"foto",
        id:"fotoAtleta",
        name:"fotoAtleta",
        type:"file",
        autoComplete:"foto",
        isRequired:false,
        placeholder:"Foto do Atleta" 
    }
]

const ModalStaffFields = [
    {
        labelText:"Nome do Membro do Staff",
        labelFor:"nome",
        id:"nome",
        name:"nome",
        type:"text",
        autoComplete:"nome",
        isRequired:true,
        placeholder:"Nome do Membro do Staff"   
    },
    {
        labelText:"Data de Nascimento",
        labelFor:"nascimento",
        id:"nascimento",
        name:"nascimento",
        type:"text",
        autoComplete:"nascimento",
        isRequired:true,
        placeholder:"Data de Nascimento"   
    },
    {
        labelText:"Documento",
        labelFor:"documento",
        id:"documento",
        name:"documento",
        type:"text",
        autoComplete:"documento",
        isRequired:true,
        placeholder:"RG/CPF"  
    },
    {
        labelText: "Cargo",
        labelFor: "cargo",
        id: "cargo",
        name: "cargo",
        type: "dropdown",
        isRequired: true,
        options: [
        { value: "tecnico", label: "Técnico" },
        { value: "medico", label: "Médico" },
        { value: "preparador fisico", label: "Preparador Físico" },
        { value: "diretor", label: "Diretor" },
        ],
        placeholder: "Cargo",
    },
    {
        labelText:"Foto do Membro do Staff",
        labelFor:"foto",
        id:"foto",
        name:"foto",
        type:"file",
        autoComplete:"foto",
        isRequired:true,
        placeholder:"Foto do Membro do Staff" 
    }
]

const ModalCompeticaoFields = [
    {
        labelText:"Nome da Competição",
        labelFor:"nome",
        id:"nome",
        name:"nome",
        type:"text",
        autoComplete:"nome",
        isRequired:true,
        placeholder:"Nome da Competição"   
    },
    {
        labelText:"Data de Início",
        labelFor:"inicio",
        id:"inicio",
        name:"inicio",
        type:"text",
        autoComplete:"inicio",
        isRequired:true,
        placeholder:"Data de Início"   
    },
    {
        labelText: "Categoria",
        labelFor: "categoria",
        id: "categoria",
        name: "categoria",
        type: "dropdown",
        isRequired: true,
        options: [
        { value: "sub9", label: "Sub-9" },
        { value: "sub11", label: "Sub-11" },
        { value: "sub13", label: "Sub-13" },
        { value: "sub15", label: "Sub-15" },
        { value: "sub17", label: "Sub-17" },
        ],
        placeholder: "Categoria",
    },
    {
        labelText: "Tipo",
        labelFor: "tipo",
        id: "tipo",
        name: "tipo",
        type: "dropdown",
        isRequired: true,
        options: [
        { value: "Grupos + Eliminacao", label: "Grupos + Eliminação" },
        { value: "Eliminacao", label: "Eliminação" }
        ],
        placeholder: "Tipo da Competição",
    },
    {
        labelText:"Cidade da Competição",
        labelFor:"cidade",
        id:"cidade",
        name:"cidade",
        type:"text",
        autoComplete:"cidade",
        isRequired:true,
        placeholder:"Cidade da Competição" 
    },
    {
        labelText:"Número de Participantes",
        labelFor:"numeroparticipantes",
        id:"numeroparticipantes",
        name:"numeroparticipantes",
        type:"number",
        autoComplete:"numeroparticipantes",
        isRequired:true,
        placeholder:"Número de Participantes" 
    },
    {
        labelText:"Logo da Competição",
        labelFor:"logo",
        id:"logo",
        name:"logo",
        type:"file",
        autoComplete:"logo",
        isRequired:true,
        placeholder:"Logo da Competição" 
    }
]

export {loginFields,signupFields,ModalAtletaFields,ModalStaffFields, ModalCompeticaoFields}