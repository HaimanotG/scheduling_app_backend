import React from 'react';
import styled from 'styled-components';
import {Link} from "react-router-dom";

const CollegeListElementWrapper = styled(Link)`
    text-decoration: none;
    display: block;
    padding: 10px;
    background: var(--component-background);
    border-radius: 5px;
    
    :hover {
        background: rgba(255,255,255,.5);
        cursor: pointer;
    }
    
    :not(last-child) {
        margin-top: 10px;
    }
`;

const CollegeListElement = (item) => {
    return (
        <CollegeListElementWrapper to={'/admin/college'}>
            {item.name} | {item.dean.username}
        </CollegeListElementWrapper>
    )
};

export default CollegeListElement;