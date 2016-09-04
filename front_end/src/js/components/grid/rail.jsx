import React from 'react';
import moment from 'moment';

export default class Rail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      now: moment(),
    };
  }

  componentDidMount() {
    this.intervalId = setInterval(()=> {
      this.setState({
        now: moment(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const {
      arrivalStation,
      arrivalTimeStr,
      departureStation,
      departureTimeStr,
    } = this.props.data;

    const departureTime = moment(departureTimeStr);
    const arrivalTime = moment(arrivalTimeStr);

    // 現在の時間と電車の発車時間の差
    const duration = moment.duration(arrivalTime.diff(this.state.now));
    let remainingTimeText;
    if (duration.asHours() > 0) {
      // 電車はまだ発車していない
      remainingTimeText = `残り ${duration.hours()}:${duration.minutes()}`;
    } else {
      remainingTimeText = '電車発車済み';
    }

    return (
      <div style={{textAlign: 'center', margin: '20px 0 0'}}>
        <div className="row">
          <div className="col-xs-5">
            <div className="box">
              <div>{departureStation}</div>
              <div>{departureTime.format('HH:mm')}</div>
            </div>
          </div>
          <div className="col-xs-2">
            <div className="box">
              =>
            </div>
          </div>
          <div className="col-xs-5">
            <div className="box">
              <div>{arrivalStation}</div>
              <div>{arrivalTime.format('HH:mm')}</div>
            </div>
          </div>
          <div className="col-xs-12">
            <div className="box">
              {remainingTimeText}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Rail.propTypes = {
  data: React.PropTypes.shape({
    arrivalStation: React.PropTypes.string.isRequired,
    arrivalTimeStr: React.PropTypes.string.isRequired,
    departureStation: React.PropTypes.string.isRequired,
    departureTimeStr: React.PropTypes.string.isRequired,
  }),
};