import React from 'react';

export default class SimpleText extends React.Component {
  render() {
    return (
      <div>{this.props.data}</div>
    );
  }
}

SimpleText.propTypes = {
  data: React.PropTypes.string.isRequired,
};