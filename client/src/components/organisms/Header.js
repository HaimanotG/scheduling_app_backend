import React from 'react'
import styled from "styled-components";
import {Link} from "react-router-dom";
import Container from "../styled-components/Container";
import Breadcrumbs from "../atoms/BreadCrumbs";

const HeaderWrapper = styled.header`
    height: 100px;
    padding: 10px;
    background: var(--secondary);
    box-shadow: 2px 4px 10px rgba(0,0,0,.2);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
`;

const HeaderBody = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
`;

const Actions = styled.div`
    margin-left: auto;
    color: #fff;
`;

const HeaderText = styled.h2`
    color: #fff;
    letter-spacing: 1.12px; 
    font-size: 1.5em;
    span {
        color: #eee;
    }
`;

const Action = styled(Link)`
    color: #fff;
    
    :hover {
        text-decoration: none;
    }
`;

const WelcomeText = styled.span`
    padding: 5px;
`;

const Left = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
`;

const Header = ({isLoggedIn, onLogout, username = "", path}) => {
    return (
        <HeaderWrapper>
            <Container>
                <HeaderBody>
                    <Left>
                        <HeaderText>Scheduling<span>App</span></HeaderText>
                        <Breadcrumbs path={path}/>
                    </Left>
                    <Actions>
                        {isLoggedIn && <WelcomeText>
                            Welcome <strong>{username}</strong>, </WelcomeText> }
                        {isLoggedIn ? <Action to='/logout' onClick={onLogout}>Log out</Action> :
                            <Action to='/login'>Login</Action> }
                    </Actions>
                </HeaderBody>
            </Container>
        </HeaderWrapper>
    )
};
export default Header;