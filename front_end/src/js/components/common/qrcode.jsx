import React from 'react';
import qrcode from 'qrcode-npm';

import {baseUrl} from '../../utils/url.js';

export default function QrCode(props) {
  // バージョン9 誤り訂正レベルMのQRコードを生成
  const qr = qrcode.qrcode(9, 'M');
  const androidUrl = `projegrid://projegrid.com/checkin?screenId=${props.screenId}&screenToken=${props.screenToken}`;
  qr.addData(androidUrl);
  qr.make();
  const qrImg = qr.createImgTag(3);

  const browserUrl = `${baseUrl()}/auth/check_in.html?screen_id=${props.screenId}&screen_token=${props.screenToken}`;

  return (
    <div>
      <div dangerouslySetInnerHTML={{__html: qrImg}}/>
      <div>{browserUrl}</div>
    </div>
  );
}

QrCode.propTypes = {
  screenId: React.PropTypes.string.isRequired,
  screenToken: React.PropTypes.string.isRequired,
};