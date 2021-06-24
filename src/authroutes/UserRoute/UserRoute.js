import { Redirect, Route } from "react-router-dom";
import PropTypes from 'prop-types';
import { connect } from "react-redux";

const UserRoute = props => {
    const { isAuthenticated, layout: Layout, component: Component, ...rest } = props;

    return(
        <Route 
            { ...rest }
            render={matchProps => (
                <Layout>
                    { !isAuthenticated ? <Component {...matchProps} /> : <Redirect to="/home" /> } 
                </Layout>
            )}
        />
    )
}

UserRoute.propTypes = {
    path: PropTypes.string.isRequired,
    component: PropTypes.any.isRequired,
    layout: PropTypes.any.isRequired
}

function mapStateToProps(state){
    return{
        isAuthenticated: !!state.auth.email
    }
}

export default connect(mapStateToProps, null)(UserRoute);