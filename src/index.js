import React from "react";
import  ReactDOM  from "react-dom";
import './index.css';
import { ContextProvider } from './contexts/ContextProvider';

import App from './App';
import { Cabecalho } from "./components";

ReactDOM.render(
    <ContextProvider>
        <Cabecalho>
        </Cabecalho>
        <App />               
    </ContextProvider>, 
document.getElementById('root'));