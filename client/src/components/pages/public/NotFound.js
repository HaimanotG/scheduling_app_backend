import React from 'react';
import styled from 'styled-components';
import Container from "../../styled-components/Container";

const NotFoundWrapper = styled.h2`
    background: var(--primary);
    text-align: center;
    
    padding: 10px;
    color: #fff;
`;

const NotFound = () => {
    return (
        <Container>
            <NotFoundWrapper>
                404
            </NotFoundWrapper>
        </Container>
    )
};

export default NotFound;