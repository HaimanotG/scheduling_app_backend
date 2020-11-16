import React from "react";
import styled from 'styled-components';
import { Link } from "react-router-dom";

const StyledBreadCrumb = styled.div`
    margin-top: 12px;
    span {
        padding: 10px;
        color: #bbb;
    }
`;

const StyledCrumb = styled(Link)`
    padding: 10px;
    position: relative;
    text-decoration: none;
    :link,
    :visited,
    :active {
        color: #fff;
    }
    
    :hover {
        text-decoration: underline;
    }
    
    :first-child {
        padding-left: 0;
    }
    
    ::after{
        content: ">";
        position: absolute;
        right: -5px;
        top: 10px;
        display: inline-block;
        color: #aaa;
    }
`;

const Breadcrumbs = ({ path }) => {
    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    const clean = str => {
        let clean = str;
        if (clean.charAt(0) === '/') {
            clean = clean.slice(1);
        }
        if (clean.charAt(clean.length - 1) === '/') {
            clean = clean.substr(0, clean.length - 1);
        }
        return clean;
    };

    const cleanPath = clean(path);
    let crumbs = cleanPath.split('/').filter(p => p.charAt(0) !== '5').map(p =>
        ({name: capitalize(p), path: path.substr(0, path.indexOf(p) + p.length)}));

    for (let i = 0; i < crumbs.length; i++) {
        if (crumbs[i].name === 'Edit' || crumbs[i].name === 'Add') {
            crumbs[i].name = crumbs[i].name + " " + crumbs[i - 1].name;
        }
    }

    if (crumbs.length <= 1) {
        return null;
    }
    return (
        <StyledBreadCrumb>
            {crumbs.map(({ name, path }, key) =>
                key + 1 === crumbs.length ? (
                        <span key={key}>{name}</span>
                    ) : (
                    <StyledCrumb key={key} to={path}>
                        {name}
                    </StyledCrumb>
                )
            )}
        </StyledBreadCrumb>
    );
};
export default Breadcrumbs;
