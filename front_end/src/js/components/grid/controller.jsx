import React from 'react';

import QrCode from '../common/qrcode.jsx';

const styleIconWrapper = {
  height: '50px',
  width: '50px',
  backgroundColor: '#999',
  borderRadius: '50%',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const styleIcon = {

};

export default class Controller extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-xs-2">
          <div className="box">
            <div style={styleIconWrapper}>
              <i className="fa fa-trash-o fa-2x" aria-hidden="true" style={styleIcon}></i>
            </div>
          </div>
        </div>
        <div className="col-xs-4">
          <div className="box">
            <QrCode screenId={this.props.screenId} screenToken={this.props.screenToken}/>
          </div>
        </div>
        <div className="col-xs-6">
          <div className="box">
            <ul>
              <li>111111111</li>
              <li>222222222</li>
              <li>333333333</li>
              <li>444444444</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

Controller.propTypes = {
  screenId: React.PropTypes.string.isRequired,
  screenToken: React.PropTypes.string.isRequired,
};