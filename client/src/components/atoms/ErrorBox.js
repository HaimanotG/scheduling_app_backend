import React from 'react';
import styled from 'styled-components';

const ErrorBoxWrapper = styled.div`
    box-shadow: 0px 0px 7px 1px var(--warning);
    border: 1px solid var(--warning);
    border-radius: 5px;
    padding: 10px;
    margin: 5px 0;
`;

const ErrorBox = ({label}) => {
    return (
        <ErrorBoxWrapper>
            {label}
        </ErrorBoxWrapper>
    )
};

export default ErrorBox;