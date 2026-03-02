import React from 'react';
import Navigator from './navigation';
import Splash from './Splash';

export default class extends React.Component {
  state = {
    isLoading: true
  };

  componentDidMount = async () => {
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 500);
  }

  render() {
    if (this.state.isLoading) {
      return <Splash />;
    } else {
      return <Navigator />;
    }
  }
}