import React, { Component } from 'react';

export default (WrappedComponent, resourceAPI) => {
    class WithDataFetching extends Component {
        state = {
            data: [],
            loading: false,
            error: '',
        };

        async componentDidMount() {
            this.setState({ loading: true });
            const { success, data, error } = await resourceAPI();
            if (success) {
                this.setState({ data, loading: false })
            } else {
                this.setState({ loading: false, error });
            }
        }

        render() {
            const { data, error, loading } = this.state;
            return <WrappedComponent
                data={data}
                error={error}
                loading={loading}
                {...this.props}
            />
        }
    }

    const WrappedName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    WithDataFetching.displayName = `WithDataFetching(${WrappedName})`;
    return WithDataFetching;
}
