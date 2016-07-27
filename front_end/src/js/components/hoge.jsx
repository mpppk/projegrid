import React from 'react';

export class Hoge extends React.Component{

  constructor(props){
    super(props);
    this.state = {time: 0};

    this.countUp = this.countUp.bind(this);
  }

  componentDidMount(){
    this.countUp();
  }

  countUp(){
    this.setState({
      time: this.state.time + 1
    });
    setTimeout(this.countUp, 1000);
  }

  render(){
    return(
      <div>
        <div>
          Time: { this.state.time }
        </div>
        <div>
          Hello!
        </div>
      </div>
    );
  }
}
