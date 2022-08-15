import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

import { Provider } from 'react-redux';
import  store  from '../store';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <div className="main">
        <Header />
        <Component {...pageProps} />

        {/* <Footer />
        <ModalSearch />
        <ModalMenu />
        <Scrollup /> */}
        <Footer />
      </div>
    </Provider>


  )
}

export default MyApp