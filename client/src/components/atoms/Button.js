import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const BaseButton = styled.button`
  display: ${props => (props.block ? "block" : "inline-block")};
  padding: ${props => (props.sm ? "8px" : "1em 3em")};
  border: none;
  outline: none;

  cursor: pointer;
  border-radius: 5px;
  color: ${({ subtle, color }) => (subtle ? color : "#fff")};
  margin: 1px;
  background: ${({ accent, warning, info, subtle }) => {
        if (subtle) {
            return "none";
        }
        if (accent) {
            return "var(--accent)";
        } else if (warning) {
            return "var(--warning)";
        } else if (info) {
            return "var(--info)";
        } else {
            return "var(--primary)";
        }
    }};

  :hover {
    opacity: 0.7;
  }

  :disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
`;
/**
 *
 * @param label Boolean
 * @param disabled Boolean
 * @param info Boolean
 * @param warning Boolean
 * @param accent Boolean
 * @param primary Boolean
 * @param sm Boolean
 * @param subtle Boolean
 * @param color
 * @param onClick Function
 * @returns {?Function}
 * @constructor
 */

const Button = ({
    label,
    disabled = false,
    info = false,
    warning = false,
    accent = false,
    primary = false,
    sm = false,
    block = false,
    subtle = false,
    color,
    onClick
}) => (
        <BaseButton
            disabled={disabled}
            info={info}
            warning={warning}
            primary={primary}
            accent={accent}
            sm={sm}
            block={block}
            subtle={subtle}
            color={color}
            onClick={onClick}
        >
            {label}
        </BaseButton>
    );

Button.propTypes = {
    label: PropTypes.string,
    disabled: PropTypes.bool,
    info: PropTypes.bool,
    warning: PropTypes.bool,
    primary: PropTypes.bool,
    accent: PropTypes.bool,
    sm: PropTypes.bool,
    subtle: PropTypes.bool,
    color: PropTypes.string,
    block: PropTypes.bool
};

export default Button;
