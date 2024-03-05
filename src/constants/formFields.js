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
        placeholder:"Estado",
       
      
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
        placeholder:"Data de Nascimento",
        mask: "99/99/9999" 
    },
    {
        labelText:"Documento",
        labelFor:"documento",
        id:"documentNumber",
        name:"documentNumber",
        type:"text",
        autoComplete:"documento",
        isRequired:true,
        placeholder:"CPF",  
        //mask: "999.999.999-99"
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
        id:"name",
        name:"name",
        type:"text",
        autoComplete:"nome",
        isRequired:true,
        placeholder:"Nome do Membro do Staff"   
    },
    {
        labelText:"Data de Nascimento",
        labelFor:"nascimento",
        id:"dateOfBirth",
        name:"dateOfBirth",
        type:"text",
        autoComplete:"nascimento",
        isRequired:true,
        placeholder:"Data de Nascimento",
        mask: "99/99/9999"    
    },
    {
        labelText:"Documento",
        labelFor:"documento",
        id:"documentNumber",
        name:"documentNumber",
        type:"text",
        autoComplete:"documento",
        isRequired:true,
        placeholder:"CPF",
        //mask: "999.999.999-99"   
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
        id:"fotoStaff",
        name:"fotoStaff",
        type:"file",
        autoComplete:"foto",
        isRequired:true,
        placeholder:"Foto do Membro do Staff" 
    }
]

const ModalPerfilFields = [
    {
        labelText:"Logo da Equipe",
        labelFor:"logo",
        id:"logo",
        name:"logo",
        type:"file",
        autoComplete:"logo",
        isRequired:true,
        placeholder:"Logo da Equipe" 
    }
]

const ModalGrupoFields = [
    {
        labelText:"Nome do Grupo",
        labelFor:"nome",
        id:"name",
        name:"name",
        type:"text",
        autoComplete:"nome",
        isRequired:true,
        placeholder:"Nome do Grupo"   
    },
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
        id:"dataInicio",
        name:"dataInicio",
        type:"text",
        autoComplete:"inicio",
        isRequired:true,
        placeholder:"Data de Início",
        mask: "99/99/9999"    
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
        id: "tipoCompeticao",
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
        labelText: "Tipo Fase de Grupos",
        labelFor: "tipoGrupo",
        id: "tipoGrupo",
        name: "tipoGrupo",
        type: "dropdown",
        isRequired: true,
        options: [
        { value: "Ida + Volta", label: "Ida + Volta" },
        { value: "Apenas Ida", label: "Apenas Ida" }
        ],
        placeholder: "Tipo Fase de Grupos",
    },
    {
        labelText: "Tipo Fase de Eliminação",
        labelFor: "tipoMataMata",
        id: "tipoMataMata",
        name: "tipoMataMata",
        type: "dropdown",
        isRequired: true,
        options: [
        { value: "Ida + Volta", label: "Ida + Volta" },
        { value: "Apenas Ida", label: "Apenas Ida" }
        ],
        placeholder: "Tipo Fase de Eliminação",
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
        id:"participantes",
        name:"participantes",
        type:"number",
        autoComplete:"numeroparticipantes",
        isRequired:true,
        placeholder:"Número de Participantes" 
    },
    {
        labelText:"Quantidade de Grupos",
        labelFor:"numerogrupos",
        id:"quantidadeGrupos",
        name:"quantidadeGrupos",
        type:"number",
        autoComplete:"numerogrupos",
        isRequired:true,
        placeholder:"Quantidade de Grupos" 
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

const ModalAdicionarJogoFields = [
    {
        labelText:"Data",
        labelFor:"",
        id:"data",
        name:"data",
        type:"text",
        autoComplete:"data",
        isRequired:true,
        placeholder:"Data da Partida",
        mask: "99/99/9999"    
    },
    {
        labelText: "Tipo",
        labelFor: "tipo",
        id: "tipo",
        name: "tipo",
        type: "dropdown",
        isRequired: true,
        options: [
        { value: "Grupos", label: "Grupos" },
        { value: "Eliminacao", label: "Eliminação" }
        ],
        placeholder: "Tipo da Partida",
    },
    {
        labelText: "Hora",
        labelFor: "hora",
        id: "hora",
        name: "hora",
        type:"text",
        autoComplete:"hora",
        isRequired:true,
        placeholder:"Hora da Partida",
        mask: "99:99"
    },
    {
        labelText: "Local",
        labelFor: "local",
        id: "local",
        name: "local",
        type:"text",
        autoComplete:"local",
        isRequired:true,
        placeholder:"Local da Partida",
    },
  ]
    const ModalSumulaJogoFields = [
        {
            labelText:"Gols da Equipe da Casa",
            labelFor:"",
            id:"userCasaGols",
            name:"userCasaGols",
            type:"number",
            autoComplete:"userCasaGols",
            isRequired:true,
            placeholder:"Gols da Equipe da Casa",
                
        },
        {
            labelText:"Gols da Equipe de Fora",
            labelFor:"",
            id:"userForaGols",
            name:"userForaGols",
            type:"number",
            autoComplete:"userForaGols",
            isRequired:true,
            placeholder:"Gols da Equipe de Fora",
                
        },           
    ]
    const ModalAdmFields=[
        {
            labelText:"Nome",
            labelFor:"nome",
            id:"teamName",
            name:"teamName",
            type:"text",
            autoComplete:"nome",
            isRequired:true,
            placeholder:"Nome do Adm"   
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
        }
    ]

export {loginFields,signupFields,ModalAtletaFields,
    ModalStaffFields, ModalCompeticaoFields, ModalPerfilFields,
    ModalGrupoFields, ModalAdicionarJogoFields, ModalSumulaJogoFields,
    ModalAdmFields
    }