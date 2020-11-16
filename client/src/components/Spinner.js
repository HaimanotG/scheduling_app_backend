import React from 'react';
import styled,{keyframes} from "styled-components";

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
    
    to { 
        transform: rotate(360deg);
    }
`;

const Circle = styled.div`
    height: 100px;
    width: 100px;
    background: none;
    border-radius: 50%;
    
    border: 10px solid #fff;
    border-top: 10px solid var(--primary);
    animation: ${rotate} 2s linear infinite;
    position: absolute;
    left: 45%;
    top: 40%;
    transform: translate(-50%, -50%);
`;

const SpinnerWrapper = styled.div`
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(255,255,255,0.5);
`;

const Spinner = () => {
    return (
        <SpinnerWrapper>
            <Circle/>
        </SpinnerWrapper>
    )
};
export default Spinner;