import {useEffect,useState} from 'react';

const useDarkMode = () => {
    const [theme,setTheme] = useState('light');
    const [componentMounted,setComponentMounted] = useState(false);
    const setMode = mode => {
        window.localStorage.setItem('theme',mode);
        setTheme(mode);
    };

    const toggleTheme = () =>
        theme === 'light' ? setMode('dark') : setMode('light');

    useEffect(()=>{
        const localMode = window.localStorage.getItem('theme');
        localMode ? setMode(localMode) : setTheme('light');
        setComponentMounted(true);
    },[]);

    return [theme,toggleTheme,componentMounted];
};

export default useDarkMode;