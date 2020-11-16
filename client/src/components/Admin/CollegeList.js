import React from "react";

import Container from "../../containers/Container";
import Button from "../atoms/Button";
import AdminAPI from "../../api/AdminAPI";
import withDataFetching from "../../withDataFetching";
import Spinner from "../Spinner";
import ErrorBox from "../ErrorBox";
import DataTable from "../DataTable";
import StyledLink from "../StyledLink";

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

const makeColleges = data =>
    data.colleges.map(college => ({
        _id: college._id,
        name: college.name,
        dean: college.dean ? college.dean.username : "UNASSIGNED",
        departments: college.departments.length
    }));

const CollegeList = ({ data, error, loading, ...props }) => {
    const handleAdd = e => {
        e.preventDefault();
        props.history.push("/admin/college/add");
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
                <Button label={"Add College"} onClick={handleAdd} accent />
            </div>
            <DataTable data={makeColleges(data)} cols={colList} />
        </Container>
    );
};

export default withDataFetching(CollegeList, AdminAPI.getColleges);
