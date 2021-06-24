import React from 'react';
import PropTypes from 'prop-types';

const MinLayout = props => {
    return(
        <div>
            <p>navbar</p>
            {props.children}
        </div>
    )
}

MinLayout.propTypes = {
    children: PropTypes.node.isRequired
}

export default MinLayout;