import React from 'react';
import {Link} from "react-router-dom";
import styled from "styled-components";
import Container from "../../styled-components/Container";
import Wrapper from "../../styled-components/Wrapper";

const AdminHeader = styled.h4`
    background: var(--primary);
    padding: 10px;
    
    > a {
        :link,
        :visited,
        :hover,
        :active{
            color: #fff;
        }
        border: none;
    }
`;

const Anchor = styled(Link)`
    text-decoration: none;
    transition: text-decoration .2s;
    
    :link,
    :visited,
    :hover,
    :active {
        color: var(--text-color);
    }
    
    :hover {
        color: var(--primary);
    }
`;

const ActionBar = styled.div`
    display: flex;
    flex-direction: column;
    
    > a {
        font-size: .95em;
        padding: 8px 10px;
    }
`;

const ActionGroup = styled.div`
    padding: 10px;
    display: flex;
    
    :not(:last-child) {
        border-bottom: 1px solid #ddd;
    }
`;

const Actions = styled.div`
    margin-left: auto;
    display: flex;
    color: var(--text-color);
    > a {
        :not(:last-child) {
            margin-right: 10px;
        }
    }
`;

const Admin = () => {

    return (
        <Container>
            <Wrapper>
                <AdminHeader>
                    <Anchor to={'/admin'}>Admin</Anchor>
                </AdminHeader>
                <ActionBar>
                    <ActionGroup>
                        <Anchor to={'/admin/dean'}>Dean</Anchor>
                        <Actions>
                            <Anchor to={'/admin/dean/add'}>Add</Anchor>
                        </Actions>
                    </ActionGroup>
                    <ActionGroup>
                        <Anchor to={'/admin/college'}>College</Anchor>
                        <Actions>
                            <Anchor to={'/admin/college/add'}>Add</Anchor>
                        </Actions>
                    </ActionGroup>
                </ActionBar>
            </Wrapper>
        </Container>
    )
};

export default Admin;