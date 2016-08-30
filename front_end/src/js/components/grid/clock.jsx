import React from 'react';

export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      now: new Date(),
    };
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState({
        now: new Date(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const currentTime = this.state.now.getHours() + ':' + this.state.now.getMinutes();

    return (
      <div>
        <div style={{fontSize: '50px', fontWeight: '400', padding: '16px 0 8px', textAlign: 'center'}}>
          {currentTime}
        </div>
        <div style={{fontSize: '20px', fontWeight: '300'}}>
          {this.props.data}
        </div>
      </div>
    );
  }
}

Clock.propTypes = {
  data: React.PropTypes.string.isRequired,
};