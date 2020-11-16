const baseTheme = {
    // primary: 'rgb(39,105,162)',
    // secondary: 'rgb(34,66,118)',
    // primary: '#795548',
    // secondary: '#5d4037',
    primary: '#607d8b',
    secondary: '#455a64',
    // primary: '#e91e63',
    // secondary: '#c2185b',
    // primary: '#9c27b0',
    // secondary: '#7b1fa2',
    // primary: '#ffc107',
    // secondary: '#ffa000',
    accent: 'rgb(240, 96, 96)',
    warning: 'rgb(255,10,20)',
    info: 'rgb(46,103,255)'
};

export const lightTheme = {
    ...baseTheme,
    body : "#edf2f7",
    text: '#363537',
    componentBackground: '#fff',
    // componentBoxShadow: '0 6px 10px -4px rgba(0, 0, 0, 0.15)',
    componentBoxShadow: '0px 0px 0.714286rem rgb(204, 204, 204)'
};

export const darkTheme = {
    ...baseTheme,
    body: "rgb(14, 20, 27)",
    text: '#FAFAFA',
    componentBackground: 'rgb(51,51,51)',
    componentBoxShadow: '1px 1px 1px 0 rgba(255,255,255,.25)'
};