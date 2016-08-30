export function baseUrl() {
  let portText = location.port;
  if (portText === 80) {
    portText = '';
  } else {
    portText = ':' + portText;
  }
  return location.protocol + '//' + location.hostname + portText;
}