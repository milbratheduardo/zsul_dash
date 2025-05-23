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

const ModalEditarAtletaFields = [
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
        labelText:"Nome da Equipe",
        labelFor:"teamName",
        id:"teamName",
        name:"teamName",
        type:"text",
        autoComplete:"nome",
        isRequired:true,
        placeholder:"Nome da Equipe"   
    },
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
        labelFor:"name",
        id:"name",
        name:"name",
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
        { value: "9", label: "Sub-9" },
        { value: "10", label: "Sub-10" },
        { value: "11", label: "Sub-11" },
        { value: "12", label: "Sub-12" },
        { value: "13", label: "Sub-13" },
        { value: "14", label: "Sub-14" },
        { value: "15", label: "Sub-15" },
        { value: "16", label: "Sub-16" },
        { value: "17", label: "Sub-17" },
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
        labelText: "Status",
        labelFor: "status",
        id: "status",
        name: "status",
        type: "dropdown",
        isRequired: true,
        options: [
        { value: "aberto", label: "Aberto para Inscrições" },
        { value: "fechado", label: "Fechado para Inscrições" },
        { value: "finalizado", label: "Campeonato Finalizado" }
        ],
        placeholder: "Status da Competição",
    },
    {
        labelText: "inscricaoAtletas",
        labelFor: "inscricaoAtletas",
        id: "inscricoesAtletas",
        name: "inscricoesAtletas",
        type: "dropdown",
        isRequired: true,
        options: [
        { value: "aberto", label: "Aberto para Inscrições" },
        { value: "fechado", label: "Fechado para Inscrições" },
        ],
        placeholder: "Status Inscrição de Atletas",
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
        labelText:"vagas",
        labelFor:"vagas",
        id:"vagas",
        name:"vagas",
        type:"number",
        autoComplete:"vagas",
        isRequired:true,
        placeholder:"Vagas Disponíveis" 
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
        { value: "Eliminacao", label: "Eliminação" },
        { value: "Segunda Fase", label: "Segunda Fase" }
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

    const ModalEditarPunicaoFields = [
        {
            labelText:"Dias de Punição",
            labelFor:"",
            id:"punicao",
            name:"punicao",
            type:"text",
            autoComplete:"punicao",
            isRequired:true,
            placeholder:"Dias de Punição",
                
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

    const ModalTransferenciaFields=[
        {
            labelText:"Motivo",
            labelFor:"Motivo",
            id:"motivo",
            name:"motivo",
            type:"text",
            autoComplete:"motivo",
            isRequired:true,
            placeholder:"Motivo da Transferência"   
        },
        {
            labelText:"Data",
            labelFor:"",
            id:"data",
            name:"data",
            type:"text",
            autoComplete:"data",
            isRequired:true,
            placeholder:"Data da Solicitação",
            mask: "99/99/9999"    
        },
        
    ]

    const ModalCamposFields=[
        {
            labelText:"Nome do Estádio",
            labelFor:"name",
            id:"nome",
            name:"nome",
            type:"text",
            autoComplete:"name",
            isRequired:true,
            placeholder:"Nome do Estádio"   
        },
        {
            labelText:"Endereço do Estádio",
            labelFor:"endereco",
            id:"endereco",
            name:"endereco",
            type:"text",
            autoComplete:"endereco",
            isRequired:true,
            placeholder:"Endereço do Estádio"   
        },
        {
            labelText:"Cidade do Estádio",
            labelFor:"cidade",
            id:"cidade",
            name:"cidade",
            type:"text",
            autoComplete:"cidade",
            isRequired:true,
            placeholder:"Cidade do Estádio"   
        },
        {
            labelText:"Link Google Maps",
            labelFor:"maps",
            id:"linkMaps",
            name:"linkMaps",
            type:"text",
            autoComplete:"maps",
            isRequired:true,
            placeholder:"Link Google Maps"   
        },
        {
            labelText:"Imagem do Estádio",
            labelFor:"imagem",
            id:"imagem",
            name:"imagem",
            type:"file",
            autoComplete:"imagem",
            isRequired:true,
            placeholder:"Imagem do Estádio" 
        }
        
    ]

    const ModalAdicionarPostFields = [
        {
            labelText:"Título da Notícia",
            labelFor:"titulo",
            id:"titulo",
            name:"titulo",
            type:"text",
            autoComplete:"titulo",
            isRequired:true,
            placeholder:"Título da Notícia"   
        },      
        {
            labelText:"Descrição",
            labelFor:"subtitulo",
            id:"subtitulo",
            name:"subtitulo",
            type:"text",
            autoComplete:"subtitulo",
            isRequired:true,
            placeholder:"Descrição" 
        },
        {
            labelText:"texto",
            labelFor:"texto",
            id:"texto",
            name:"texto",
            type:"text-area",
            autoComplete:"text",
            isRequired:true,
            placeholder:"Texto da Postagem" 
        },
        {
            labelText:"Imagem da Postagem",
            labelFor:"imagem",
            id:"imagem",
            name:"imagem",
            type:"file",
            autoComplete:"imagem",
            isRequired:true,
            placeholder:"Imagem da Postagem" 
        }
    ]

    const ModalAdicionarFotoFields = [     
        {
            labelText:"Nome do Fotógrafo",
            labelFor:"nome",
            id:"nome",
            name:"nome",
            type:"text",
            autoComplete:"nome",
            isRequired:true,
            placeholder:"Nome do Fotógrafo" 
        },
        {
            labelText:"Link do Fotógrafo",
            labelFor:"instagram",
            id:"instagram",
            name:"instagram",
            type:"text",
            autoComplete:"instagram",
            isRequired:true,
            placeholder:"Link do Fotógrafo" 
        },
        {
            labelText:"Link Instagram",
            labelFor:"titulo",
            id:"titulo",
            name:"titulo",
            type:"text",
            autoComplete:"instagram",
            isRequired:true,
            placeholder:"Link Instagram" 
        },
        {
            labelText:"Imagem",
            labelFor:"foto",
            id:"foto",
            name:"foto",
            type:"file",
            autoComplete:"foto",
            isRequired:true,
            placeholder:"Imagem" 
        },
        
    ]

    const ModalAdicionarPunicaoFields = [
        {
            labelText:"Punição",
            labelFor:"punicao",
            id:"punicao",
            name:"punicao",
            type:"text",
            autoComplete:"punicao",
            isRequired:true,
            placeholder:"Punição do Atleta" 
        },        
      ]

    const ModalTabelaFields = [
        {
            labelText:"Link do Drive",
            labelFor:"link",
            id:"link",
            name:"link",
            type:"text",
            autoComplete:"link",
            isRequired:true,
            placeholder:"Link do Drive" 
        },        
      ]  

export {loginFields,signupFields,ModalAtletaFields,
    ModalStaffFields, ModalCompeticaoFields, ModalPerfilFields,
    ModalGrupoFields, ModalAdicionarJogoFields, ModalSumulaJogoFields,
    ModalAdmFields, ModalTransferenciaFields, ModalCamposFields, ModalEditarAtletaFields,
    ModalAdicionarPostFields, ModalAdicionarFotoFields, ModalEditarPunicaoFields, ModalAdicionarPunicaoFields,
    ModalTabelaFields
    }