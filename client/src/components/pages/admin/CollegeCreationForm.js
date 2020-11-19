import React from "react";
import TextInputField from "../../atoms/TextInputField";
import Button from "../../atoms/Button";
import Select from "../../atoms/Select";
import AdminAPI from "../../../api/AdminAPI";
import ErrorBox from "../../atoms/ErrorBox";
import UserAPI from "../../../api/UserAPI";
import UserRole from "../../../enums/UserRole";

import { Form, Container, Wrapper, Spinner } from '../../styled-components';

const initialState = {
    name: "",
    dean: "",
    deans: [],
    error: "",
    loading: false
}

class CollegeCreationForm extends React.Component {
    state = initialState;

    async _populateDefault() {
        let { success, data, error } = await UserAPI.getUsers({
            role: UserRole.DEAN
        })();
        if (success) {
            let options = data.users.map(user => ({
                label: user.username,
                value: user._id
            }));
            this.setState({
                ...this.state,
                deans: [{ label: "--- Select ---", value: "" }, ...options],
                loading: false
            });
        } else {
            this.setState({ loading: false, error });
        }
    }

    async componentDidMount() {
        this.setState({ loading: true });
        await this._populateDefault();
        if (this.props.isEditing) {
            let { success, data: {college}, error } = await AdminAPI.getCollege(this.props.match.params.collegeId);
            if (success && college !== null) {
                let defaultState = {};
                Object.keys(initialState).forEach(key => {
                    defaultState[key] = college[key] || this.state[key];
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
        const { dean, name } = this.state;
        if (this.props.isEditing) {
            const { success, error } = await AdminAPI.updateCollege(name, dean,
                this.props.match.params.collegeId);
            if (success) {
                this.props.history.push('/admin/college');
            } else {
                this.setState({ ...this.state, error });
            }
        } else {
            const { success, error } = await AdminAPI.addCollege(name, dean);

            if (success) {
                this.props.history.push('/admin/college');
            } else {
                this.setState({ ...this.state, error });
            }
        }

    }

    handleDelete = async () => {
        const { success, error } = await AdminAPI.deleteCollege(this.props.match.params.collegeId);
        if (success) {
            this.props.history.push("/admin/college");
        } else {
            this.setState({ ...this.state, error });
        }
    }

    isFormValid = state => state.dean !== "" && state.name.length > 3;

    render() {
        const enabled = this.isFormValid(this.state);

        if (this.state.loading) {
            return <Spinner />;
        }
        return (
            <Container>
                <Wrapper>
                    <Form onSubmit={this.handleSubmit}>
                        <TextInputField
                            name={"name"}
                            value={this.state.name}
                            onChange={this.handleChange} />
                        <Select
                            value={this.state.dean}
                            options={this.state.deans}
                            onChange={this.handleChange}
                            name={"dean"}
                        />
                        <Button
                            label={this.props.isEditing ? "Update" : "Submit"}
                            disabled={!enabled}
                        />

                        {this.props.isEditing &&
                            <Button
                                label={"Delete College"}
                                block subtle sm
                                color={"rgb(255,10,20)"}
                                onClick={this.handleDelete} />}
                        {this.state.error && <ErrorBox label={this.state.error} />}
                    </Form>
                </Wrapper>
            </Container>
        );
    }
}

export default CollegeCreationForm;
