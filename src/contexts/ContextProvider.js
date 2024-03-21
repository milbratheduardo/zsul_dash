import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

const initialState = {
    userProfile: false,
};

export const ContextProvider = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [isClicked, setIsClicked] = useState(initialState);
    const [screenSize, setScreenSize] = useState(undefined);
    const [currentColor, setCurrentColor] = useState('#1A97F5');
    const [currentMode, setCurrentMode] = useState('Light');
    const [themeSettings, setThemeSettings] = useState(false);
    const [permissao, setPermissao] = useState(localStorage.getItem('permissao')); // Estado para gerenciar as permissões do usuário

    const setMode = (e) => {
        setCurrentMode(e.target.value);
        localStorage.setItem('themeMode', e.target.value);
        setThemeSettings(false);
    };

    const setColor = (color) => {
        setCurrentColor(color);
        localStorage.setItem('colorMode', color);
        setThemeSettings(false);
    };

    const handleClick = (clicked) => {
        setIsClicked({ ...initialState, [clicked]: true });
    };

    const updatePermissao = () => {
        setPermissao(localStorage.getItem('permissao'));
    };

    // Expondo o método updatePermissao através do contexto para que possa ser chamado de qualquer componente
    return (
        <StateContext.Provider value={{
            activeMenu,
            setActiveMenu,
            isClicked, 
            setIsClicked,
            handleClick,
            screenSize,
            setScreenSize,
            currentColor,
            currentMode,
            themeSettings,
            setThemeSettings,
            setColor,
            setMode,
            permissao,
            updatePermissao, // Exponha o método de atualização para ser usado após login/logout
        }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
