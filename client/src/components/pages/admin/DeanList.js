import React from "react";

import withDataFetching from "../../../withDataFetching";
import UserAPI from "../../../api/UserAPI";
import UserRole from "../../../enums/UserRole";
import Button from "../../atoms/Button";
import ErrorBox from "../../atoms/ErrorBox";
import DataTable from "../../organisms/DataTable";

import { StyledLink, Container, Spinner } from '../../styled-components';
const cols = [
    {
        title: "Username",
        render: rowData => (
            <StyledLink to={`/admin/dean/${rowData._id}/edit`}>
                {rowData.username}
            </StyledLink>
        )
    },
    {
        title: "Email",
        render: rowData => <>{rowData.email}</>
    }
];

const DeanList = ({ data: { users }, error, loading, ...props }) => {
    const handleAdd = e => {
        e.preventDefault();
        props.history.push("/admin/dean/add");
    };

    if (loading || users === undefined) {
        return <Spinner />;
    }

    if (error) {
        return <ErrorBox label={error} />;
    }

    return (
        <Container>
            <div style={{ display: "flex", flexFlow: "row-reverse", margin: "1px" }}>
                <Button label={"Add Dean"} onClick={handleAdd} accent />
            </div>
            <DataTable data={users} cols={cols} />
        </Container>
    );
};

export default withDataFetching(
    DeanList,
    UserAPI.getUsers({ role: UserRole.DEAN })
);
