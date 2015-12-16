var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var StatusView = React.createClass({
  propTypes: {
    app: React.PropTypes.object.isRequired,
    appStore: React.PropTypes.object.isRequired,
    status: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  render() {
    return (
      <span>{this.props.status.content}</span>
    );
  }
});

module.exports = StatusView;
