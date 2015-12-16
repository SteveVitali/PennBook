var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var CommentView = React.createClass({
  propTypes: {
    app: React.PropTypes.object.isRequired,
    appStore: React.PropTypes.object.isRequired,
    parent: React.PropTypes.object.isRequired,
    comment: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  render() {
    return (
      <span>{JSON.stringify(this.props.comment)}</span>
    );
  }
});

module.exports = CommentView;
