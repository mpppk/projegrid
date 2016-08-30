import React from 'react';

import SimpleText from './simple_text.jsx';
import Clock from './clock.jsx';
import Controller from './controller.jsx';

const styleGrid = {
  height: '100%',
  background: '#fff',
  boxSizing: 'border-box',
  borderRadius: '4px',
  padding: '4px 14px',
};

export default class Grids extends React.Component {
  render() {
    return (
      <div style={{boxSizing: 'border-box', background: '#EEEEEE', fontFamily: 'roboto'}}>
        <div className="row" style={{height: '49vh', padding: '7px'}}>
          <div className="col-xs-6">
            <div className="box" style={styleGrid}>

              <SimpleText data={this.props.grid1}/>

            </div>
          </div>
          <div className="col-xs-6">
            <div className="box" style={styleGrid}>

              <Clock data={this.props.grid2}/>

            </div>
          </div>
        </div>
        <div className="row" style={{height: '49vh', padding: '7px'}}>
          <div className="col-xs-6">
            <div className="box" style={styleGrid}>

              <SimpleText data={this.props.grid3}/>

            </div>
          </div>
          <div className="col-xs-6">
            <div className="box" style={styleGrid}>

              <Controller url={this.props.url}/>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

Grids.propTypes = {
  grid1: React.PropTypes.string,
  grid2: React.PropTypes.string,
  grid3: React.PropTypes.string,
  url: React.PropTypes.string.isRequired,
};