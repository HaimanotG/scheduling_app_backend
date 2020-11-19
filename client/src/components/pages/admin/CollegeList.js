import React from "react";

import Button from "../../atoms/Button";
import AdminAPI from "../../../api/AdminAPI";
import withDataFetching from "../../../withDataFetching";
import ErrorBox from "../../atoms/ErrorBox";
import DataTable from "../../organisms/DataTable";

import { Container, Spinner, StyledLink } from '../../styled-components';

const colList = [
    {
        title: "Name",
        render: rowData => (
            <StyledLink to={`/admin/college/${rowData._id}/edit`}>
                {rowData.name}
            </StyledLink>
        )
    },
    {
        title: "Dean",
        render: rowData => <>{rowData.dean}</>
    },
    {
        title: "Departments",
        render: rowData => <>{rowData.departments}</>
    }
];

const makeColleges = colleges =>
    colleges.map(college => ({
        _id: college._id,
        name: college.name,
        dean: college.dean ? college.dean.username : "UNASSIGNED",
        departments: college.departments.length
    }));

const CollegeList = ({ data: { colleges }, error, loading, ...props }) => {
    const handleAdd = e => {
        e.preventDefault();
        props.history.push("/admin/college/add");
    };

    if (loading || colleges === undefined) {
        return <Spinner />;
    }

    if (error) {
        return <ErrorBox label={error} />;
    }

    return (
        <Container>
            <div style={{ display: "flex", flexFlow: "row-reverse", margin: "1px" }}>
                <Button label={"Add College +"} onClick={handleAdd} primary />
            </div>
            <DataTable data={makeColleges(colleges)} cols={colList} />
        </Container>
    );
};

export default withDataFetching(CollegeList, AdminAPI.getColleges);
