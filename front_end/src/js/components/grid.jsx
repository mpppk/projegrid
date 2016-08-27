import React from 'react';
import qrcode from 'qrcode-npm';

export default class Grids extends React.Component {
  render() {
    return (
      <div>
        <Grid data={this.props.grid1}/>
        <Grid data={this.props.grid2}/>
        <Grid data={this.props.grid3}/>
        <QRGrid url={this.props.url}/>
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

class Grid extends React.Component {
  render() {
    return (
      <div>
        <div>Grid: {this.props.data}</div>
      </div>
    );
  }
}

Grid.propTypes = {
  data: React.PropTypes.string,
};

export const QRGrid = props => {
  // バージョン9 誤り訂正レベルMのQRコードを生成
  const qr = qrcode.qrcode(9, 'M');
  qr.addData(props.url);
  qr.make();
  const qrImg = qr.createImgTag(9);

  return (
    <div>
      <div dangerouslySetInnerHTML={{__html: qrImg}}/>
      <div>{props.url}</div>
    </div>
  );
};

QRGrid.propTypes = {
  url: React.PropTypes.string.isRequired,
};