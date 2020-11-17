import React from 'react';
import styled from "styled-components";
import PropTypes from 'prop-types';
import FormGroup from '../../styled-components/FormGroup';
import Label from '../../styled-components/Label';

const Input = styled.input`
    padding: 1em;
    outline: none;
    margin: 8px 0;
    transition: border .24s;
    border: .8px solid #bbb;
    border-radius: 5px;
    color: var(--text-color);
    background: var(--component-background);
    
    :focus {
        border: .8px solid #555;
    }
`;

const TextInputField = ({name, type = "text", onChange, required=true, value = ""}) => {
    return (
        <FormGroup>
            <Input type={type} name={name} id={name} value={value}
                   onChange={onChange} required={required}/>
            <Label htmlFor = {name} data-label={name}/>
        </FormGroup>
    )
};

TextInputField.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    onChange: PropTypes.func.isRequired
};

export default TextInputField;