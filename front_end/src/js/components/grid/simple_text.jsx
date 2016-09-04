import React from 'react';

export default class SimpleText extends React.Component {
  render() {
    return (
      <div>{this.props.data.text}</div>
    );
  }
}

SimpleText.propTypes = {
  data: React.PropTypes.shape({
    text: React.PropTypes.string.isRequired,
  }),
};