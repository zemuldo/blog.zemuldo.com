import React, { Component } from 'react';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      sessionData: null,
      user: null
    };
    this.handleSessionData = this.handleSessionData.bind(this);
    this.handleUser = this.handleUser.bind(this);
  };
  //Sets sessionData
  handleSessionData(value){
    this.setState({ sessionData: value });
  };

  //Sets user state
  handleUser(value){
    this.setState({ user: value });
  };

  render() {
    return (
      <div>
        Hello World
      </div>
    );
  }
}

export default App;
