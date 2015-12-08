var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var NavigationBarView = require('./navigation-bar.jsx');

var UserProfileView = React.createClass({
  propTypes: {
    app: React.PropTypes.object.isRequired,
    profileOwner: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  render() {
    console.log('ay', this.props);
    var Row = ReactBootstrap.Row;
    var Col = ReactBootstrap.Col;
    var Panel = ReactBootstrap.Panel;
    var Button = ReactBootstrap.Button;
    var Input = ReactBootstrap.Input;
    return (
      <span>
        <NavigationBarView/>
        <div className='container'>
          Profile for {this.props.user.firstName} {this.props.user.lastName}.
        </div>
      </span>
    );
  }
});

module.exports = UserProfileView;
