import React from 'react';
import styled from 'styled-components';
import Container from "../../styled-components/Container";

const FooterWrapper = styled.div`
    padding: 20px;
    background: var(--secondary);
`;

const FooterText = styled.p`
    color: #fff;
    text-align: center;
`;

const Footer = () => {
    return (
        <FooterWrapper>
            <Container>
                <FooterText>&copy; All Rights Reserved, 2020</FooterText>
            </Container>
        </FooterWrapper>
    )
};

export default Footer;