import React from "react";

import Container from "../../../styled-components/Container";
import Button from "../../atoms/Button";
import UserAPI from "../../../api/UserAPI";
import withDataFetching from "../../../withDataFetching";
import Spinner from "../../../styled-components/Spinner";
import ErrorBox from "../../atoms/ErrorBox";
import UserRole from "../../../enums/UserRole";
import DataTable from "../../organisms/DataTable";
import StyledLink from "../../../styled-components/StyledLink";

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

const DeanList = ({ data, error, loading, ...props }) => {
    const { users } = data;

    const handleAdd = e => {
        e.preventDefault();
        props.history.push("/admin/dean/add");
    };

    if (loading || data.length === 0) {
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
