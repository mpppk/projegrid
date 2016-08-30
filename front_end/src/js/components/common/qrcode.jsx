import React from 'react';
import qrcode from 'qrcode-npm';

export default function QrCode(props) {
  // バージョン9 誤り訂正レベルMのQRコードを生成
  const qr = qrcode.qrcode(9, 'M');
  qr.addData(props.url);
  qr.make();
  const qrImg = qr.createImgTag(3);

  return (
    <div>
      <div dangerouslySetInnerHTML={{__html: qrImg}}/>
      <div>{props.url}</div>
    </div>
  );
};

QrCode.propTypes = {
  url: React.PropTypes.string.isRequired,
};