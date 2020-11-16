import styled from 'styled-components';

const Label = styled.label`
    ::before {
        content: attr(data-label); 
        position: absolute; 
        top: 2px;
        left: .7em;
        z-index: 1; 
        padding: 2px;
        font-size: 1rem;
        text-transform: capitalize;
        color: var(--text-color);
        background: var(--component-background);
    }
`;

export default Label;