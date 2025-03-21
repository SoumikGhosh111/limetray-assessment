import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
const ThemeContext = createContext(); 

export const ThemeProvider = ({children}) => { 
    const [theme, setTheme] = useLocalStorage("theme", "light"); 

    useEffect(() => { 
        document.documentElement.setAttribute("data-theme", theme); 
    }, [theme]); 

    const toggleTheme = () => { 
        setTheme((theme) => (theme === "light" ? "dark" : "light")); 
    }

    return ( 
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    ); 

}; 

export const useTheme = () => useContext(ThemeContext); 

