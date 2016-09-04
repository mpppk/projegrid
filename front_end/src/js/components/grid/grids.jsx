import React from 'react';

import SimpleText from './simple_text.jsx';
import Controller from './controller.jsx';

const styleGrid = {
  height: '100%',
  background: '#fff',
  boxSizing: 'border-box',
  borderRadius: '4px',
  padding: '4px 14px',
  fontSize: '20px',
};

export default class Grids extends React.Component {
  render() {
    return (
      <div style={{boxSizing: 'border-box', background: '#EEEEEE', fontFamily: 'roboto'}}>
        <div className="row" style={{height: '49vh', padding: '7px'}}>
          <div className="col-xs-6">
            <div className="box" style={styleGrid}>

              <Grid data={this.props.grid1}/>

            </div>
          </div>
          <div className="col-xs-6">
            <div className="box" style={styleGrid}>

              <Grid data={this.props.grid2}/>

            </div>
          </div>
        </div>
        <div className="row" style={{height: '49vh', padding: '7px'}}>
          <div className="col-xs-6">
            <div className="box" style={styleGrid}>

              <Controller screenId={this.props.screenId} screenToken={this.props.screenToken}/>

            </div>
          </div>
          <div className="col-xs-6">
            <div className="box" style={styleGrid}>

              <Grid data={this.props.grid3}/>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

Grids.propTypes = {
  grid1: React.PropTypes.object,
  grid2: React.PropTypes.object,
  grid3: React.PropTypes.object,
  screenId: React.PropTypes.string.isRequired,
  screenToken: React.PropTypes.string.isRequired,
};

function Grid(props) {
  if (!props.data) {
    return false;
  }
  switch (props.data.type) {
    case 'SIMPLE_TEXT': {
      return (<SimpleText data={props.data}/>);
    }
    default: {
      // 何も描画しない
      return false;
    }
  }
}

Grid.propTypes = {
  data: React.PropTypes.shape({
    // グリッドの種類を表す文字列
    type: React.PropTypes.string,
  }),
};