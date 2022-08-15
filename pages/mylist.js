import React, { Component } from 'react';

import Explore from '../components/Explore/ExploreOne';

class Explorer extends Component {
    render() {
        return (
            <>
                <Explore param = {'mylist'}/>
            </>
        );
    }
}

export default Explorer;