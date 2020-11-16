import React from "react";
import Container from "../../containers/Container";
import { Form } from "../atoms/Form";
import TextInputField from "../atoms/TextInputField";
import Wrapper from "../../containers/Wrapper";
import Button from "../atoms/Button";
import Spinner from "../Spinner";
import AuthAPI from "../../api/AuthAPI";
import ErrorBox from "../ErrorBox";
import AdminAPI from "../../api/AdminAPI";

const initialState = {
    username: "",
    email: "",
    password: "",
    error: "",
    loading: false
};

class DeanCreationForm extends React.Component {
    state = initialState;

    async componentDidMount() {
        if (this.props.isEditing) {
            const { success, data, error } = await AdminAPI.getDean(
                this.props.match.params.deanId
            );
            if (success && data.dean.user !== null) {
                const dean = data.dean.user;
                let defaultState = {};
                Object.keys(initialState).forEach(key => {
                    defaultState[key] = dean[key] || initialState[key];
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
            const { success, error } = await AdminAPI.updateDean(
                username,
                email,
                this.props.match.params.deanId
            );
            if (success) {
                this.props.history.push("/admin/dean");
            } else {
                this.setState({ ...this.state, error });
            }
        } else {
            const { success, error } = await AuthAPI.register(
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
        const { success, error } = await AuthAPI.deleteUser(this.props.match.params.deanId);
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
                            <Button style={{ display: 'block' }} label={"Delete Dean"}
                                warning onClick={this.handleDelete} />}
                        {this.state.error && <ErrorBox label={this.state.error} />}
                    </Form>
                </Wrapper>
            </Container>
        );
    }
}

export default DeanCreationForm;
