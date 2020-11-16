import React, { Component } from "react";
import styled, { ThemeProvider } from "styled-components";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";

import GlobalStyles from "../GlobalStyles";
import { darkTheme, lightTheme } from "../themes";

import Login from "../components/Login/Login";
import Admin from "../components/Admin/Admin";
import Department from "../components/Department/Department";
import College from "../components/College/College";

import localStore from "../utils/localStore";
import AuthAPI from "../api/AuthAPI";
import Header from "../components/Header";

import UserRole from "../enums/UserRole";
import Footer from "../components/Footer";
import CollegeList from "../components/Admin/CollegeList";
import NotFound from "../NotFound";
import CollegeCreationForm from "../components/Admin/CollegeCreationForm";
import DeanList from "../components/Admin/DeanList";
import UserForm from "../components/UserForm";
import Home from '../Pages/Home';

const Page = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  gap: 1em;
`;

const MainContent = styled.main`
  height: auto;
`;

class App extends Component {
    state = {
        user: undefined,
        theme: "light"
    };

    redirectTo = userRole => {
        if (userRole === UserRole.ADMIN) {
            return "/admin/college";
        } else if (userRole === UserRole.DEAN) {
            return "/college";
        } else {
            return "/department";
        }
    };

    async componentDidMount() {
        const user = await localStore.get("user");
        if (user && user.sessionToken) {
            const { success } = await AuthAPI.checkSessionTokenMocked();
            if (success) {
                this.setState({ user });
                this.props.history.push(this.redirectTo(user.role));
            } else {
                await localStore.remove("user");
            }
        }
        const localMode = window.localStorage.getItem("theme");
        localMode ? this.setTheme(localMode) : this.setTheme("light");
    }

    setTheme = theme => {
        window.localStorage.setItem("theme", theme);
        this.setState({ theme });
    };

    toggleTheme = () =>
        this.state.theme === "light"
            ? this.setTheme("dark")
            : this.setTheme("light");

    handleLogin = user => {
        localStore.set("user", user);
        this.setState({ user });
        this.props.history.push(this.redirectTo(user.role));
    };

    handleLogout = e => {
        e.preventDefault();
        localStore.remove("user");
        this.setState({ user: undefined });
        this.props.history.push("/");
    };

    routes = [
        { path: "/admin", component: Admin, role: UserRole.ADMIN },
        { path: "/admin/dean", component: DeanList, role: UserRole.ADMIN },
        { path: "/admin/dean/add", component: UserForm, role: UserRole.ADMIN },
        { path: "/admin/dean/:userId/edit", component: UserForm, isEditing: true, role: UserRole.ADMIN },
        { path: "/admin/college", component: CollegeList, role: UserRole.ADMIN },
        { path: "/admin/college/add", component: CollegeCreationForm, role: UserRole.ADMIN },
        {
            path: "/admin/college/:collegeId/edit",
            component: CollegeCreationForm,
            isEditing: true, role: UserRole.ADMIN
        }
    ];

    render() {
        const themeMode = this.state.theme === "light" ? lightTheme : darkTheme;
        const isLoggedIn = this.state.user && this.state.user.sessionToken;
        const username = isLoggedIn ? this.state.user.username : "";
        const role = this.state.user && this.state.user.role;

        return (
            <ThemeProvider theme={themeMode}>
                <GlobalStyles />
                <Page>
                    <Header
                        isLoggedIn={isLoggedIn}
                        username={username}
                        onLogout={this.handleLogout}
                        path={this.props.location.pathname}
                    />
                    <MainContent>
                        <Switch>
                            <Route
                                exact
                                path="/"
                                component={() => <Home/>}
                            />
                            {this.routes.map(route => (
                                <Route
                                    key={route.path}
                                    exact
                                    path={route.path}
                                    component={props =>
                                        isLoggedIn && role === route.role ? (
                                            <route.component {...props} isEditing={route.isEditing} />
                                        ) : <Redirect to="/" />
                                    }
                                />
                            ))}
                            <Route path="/college" component={College} />
                            <Route path="/department" component={Department} />
                            <Route
                                path="/login"
                                component={() =>
                                    isLoggedIn ? (
                                        <Redirect to="/" />
                                    ) : (
                                            <Login onLogin={this.handleLogin} />
                                        )
                                }
                            />
                            <Route component={NotFound} />
                        </Switch>
                    </MainContent>
                    <Footer />
                </Page>
            </ThemeProvider>
        );
    }
}

export default withRouter(App);
