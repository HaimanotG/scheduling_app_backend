import React from "react";
import styled from "styled-components";
import FormGroup from "../../styled-components/FormGroup";
import Label from "../../styled-components/Label";

const StyledSelect = styled.select`
//   appearance: none;
  padding: 1em;
  outline: none;
  margin: 8px 0;
  transition: border 0.24s;
  border: 0.8px solid #bbb;
  border-radius: 5px;
  color: var(--text-color);
  background: var(--component-background);
  position: relative;

  :focus {
    border: 0.8px solid #555;
  }
`;

const StyledOption = styled.option`
    font-weight: normal;
    font-size: 1rem;
    display: block;
    min-height: 1.2em;
    padding: 1em;
    color: var(--text-color);
    background: var(--component-background);

    :hover {
        opacity: 0.8;
    }
`;

const SelectFormGroup = styled(FormGroup)`
    
    // ::before {
    //     content: "carat";
    //     z-index: 2;
    //     display: block;
    //     position: absolute;
    //     right: 0;
    //     top: 0;
    //     height: 2.75rem;
    //     width: 2.75rem;
    //     line-height: 2.75rem;
    //     text-align: center;
    //     pointer-events: none;
    // }
`;

const Select = ({ options, onChange, name, value }) => {
    return (
        <SelectFormGroup>
            <StyledSelect id={name} onChange={onChange} name={name} value={value}>
                {options.map(({ label, value }) => (
                    <StyledOption key={label} value={value}>
                        {label}
                    </StyledOption>
                ))}
            </StyledSelect>
            <Label htmlFor={name} data-label={name} />
        </SelectFormGroup>
    );
};

export default Select;
