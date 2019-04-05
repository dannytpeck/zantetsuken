import React, { Component } from 'react';
import Header from './header';
import Footer from './footer';
import UploadModal from './upload_modal';

/* global $ */

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div id="app">
        <Header />

        <div>

        </div>

        <Footer />
        <UploadModal />
      </div>
    );
  }
}

export default App;
