import React from "react";
import TextInputField from "../atoms/TextInputField";
import Button from "../atoms/Button";
import ErrorBox from "../atoms/ErrorBox";
import UserAPI from "../../api/UserAPI";

import { Form, Container, Wrapper, Spinner } from '../styled-components';

const initialState = {
    username: "",
    email: "",
    password: "",
    error: "",
    loading: false
};

class UserForm extends React.Component {
    state = initialState;

    async componentDidMount() {
        if (this.props.isEditing) {
            const { success, data, error } = await UserAPI.getUser(
                this.props.match.params.userId
            );
            if (success && data.user !== null) {
                const user = data.user;
                let defaultState = {};
                Object.keys(initialState).forEach(key => {
                    defaultState[key] = user[key] || initialState[key];
                });
                this.setState(defaultState);
            } else {
                this.setState({ error });
            }
        }
    }

    handleChange = e => {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    };

    handleSubmit = async e => {
        e.preventDefault();
        const { username, email, password } = this.state;
        if (this.props.isEditing) {
            const { success, error } = await UserAPI.updateUser(
                username,
                email,
                this.props.match.params.userId
            );
            if (success) {
                this.props.history.push("/admin/dean");
            } else {
                this.setState({ ...this.state, error });
            }
        } else {
            const { success, error } = await UserAPI.register(
                username,
                email,
                password
            );
            if (success) {
                this.props.history.push("/admin/dean");
            } else {
                this.setState({ ...this.state, error });
            }
        }
    };

    isFormValid = state =>
        state.username.length > 3 &&
        state.email.length > 10 &&
        state.password.length > 6;

    handleDelete = async () => {
        const { success, error } = await UserAPI.deleteUser(this.props.match.params.userId);
        if (success) {
            this.props.history.push("/admin/dean");
        } else {
            this.setState({ ...this.state, error });
        }
    }

    render() {
        const enabled = this.isFormValid(this.state);

        if (this.state.loading) {
            return <Spinner />;
        }

        const { username, email, password } = this.state;
        return (
            <Container>
                <Wrapper>
                    <Form onSubmit={this.handleSubmit}>
                        <TextInputField
                            name={"username"}
                            value={username}
                            onChange={this.handleChange}
                        />
                        <TextInputField
                            name={"email"}
                            value={email}
                            onChange={this.handleChange}
                        />

                        {!this.props.isEditing && (
                            <TextInputField
                                name={"password"}
                                value={password}
                                type={"password"}
                                onChange={this.handleChange}
                            />
                        )}

                        <Button
                            label={this.props.isEditing ? "Update" : "Register"}
                            disabled={!enabled}
                        />
                        {this.props.isEditing &&
                            <Button label={"Delete User"} block subtle sm
                                color={"rgb(255,10,20)"} onClick={this.handleDelete} />}
                        {this.state.error && <ErrorBox label={this.state.error} />}

                    </Form>
                </Wrapper>
            </Container>
        );
    }
}

export default UserForm;