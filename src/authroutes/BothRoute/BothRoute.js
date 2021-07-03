import { Route } from "react-router-dom";
import PropTypes from 'prop-types';

const BothRoute = props => {
    const { component: Component, ...rest } = props;

    return(
        <Route 
            { ...rest }
            render={matchProps => (<Component {...matchProps} />)}
        />
    )
}

BothRoute.propTypes = {
    path: PropTypes.string.isRequired,
    component: PropTypes.any.isRequired,
}

export default BothRoute;
