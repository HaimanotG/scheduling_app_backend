import React, { useState } from "react";
import styled from "styled-components";
import { Form } from "../atoms/Form";
import TextInputField from "../Form/TextInputField";
import AuthAPI from "../../api/AuthAPI";
import Spinner from "../Spinner";
import ErrorBox from "../ErrorBox";
import Button from "../Form/Button";

const LoginWrapper = styled.div`
    width: 95%;
    margin: 10px auto;
    background: var(--component-background);

    box-shadow: 0px 0.4px rgba(0, 0, 0, 0.4);
    border-left: 6px solid var(--primary);
    border-radius: 10px;

    @media (min-width: 60em) {
    width: 40%;
    transform: translateY(30%);
    }
`;

const Login = ({ onLogin }) => {
    const initialState = {
        email: "",
        password: "",
        emailError: "",
        passwordError: "",
        loading: false,
        error: ""
    };

    const [state, setState] = useState(initialState);

    const onChange = e => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    const isFormValid = state =>
        state.email.length > 10 && state.password.length > 6;

    const handleSubmit = async e => {
        e.preventDefault();
        setState({ ...state, error: "", loading: true });
        const { email, password } = state;
        const { success, data, error } = await AuthAPI.login(email, password);

        if (success) {
            setState({ ...state, loading: false });
            onLogin(data);
        } else {
            setState({ ...state, loading: false, error });
        }
    };

    const enabled = isFormValid(state);
    if (state.loading) {
        return <Spinner />;
    }
    return (
        <LoginWrapper>
            <Form onSubmit={handleSubmit}>
                <TextInputField
                    name={"email"}
                    value={state.email}
                    onChange={onChange}
                    required={true}
                />
                <TextInputField
                    name={"password"}
                    value={state.password}
                    onChange={onChange}
                    type={"password"}
                    required={true}
                />
                <Button label={"Login"} disabled={!enabled} />
                {state.error && <ErrorBox label={state.error} />}
            </Form>
        </LoginWrapper>
    );
};

export default Login;
