import React, { Component } from 'react';

// import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import Auctions from '../components/Auctions/AuctionsOne';
// import TopSeller from '../components/TopSeller/TopSellerOne';
// import Collections from '../components/Collections/Collections';
import Explore from '../components/Explore/ExploreOne';
// import Work from '../components/Work/Work';
// import ModalSearch from '../components/Modal/ModalSearch';
// import ModalMenu from '../components/Modal/ModalMenu';
// import Scrollup from '../components/Scrollup/Scrollup';

class Index extends Component {
    render() {
        return (
            <>
                <Hero />
                <Explore param = {'explore'}/>
                {/* <Auctions /> */}
                {/* <Footer /> */}
            </>
        );
    }
}

export default Index;