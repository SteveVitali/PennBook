var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var NavigationBarView = require('./navigation-bar.jsx');

var UserProfileView = React.createClass({
  propTypes: {
    app: React.PropTypes.object.isRequired,
    profileOwner: React.PropTypes.object,
    user: React.PropTypes.object.isRequired,
    lazyLoadWithUserId: React.PropTypes.string
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  render() {
    var Row = ReactBootstrap.Row;
    var Col = ReactBootstrap.Col;
    var Panel = ReactBootstrap.Panel;
    var Button = ReactBootstrap.Button;
    var Input = ReactBootstrap.Input;
    return (
      <span>
        <NavigationBarView app={this.props.app}/>
        <div className='container'>
          Profile for {this.props.profileOwner.firstName} {this.props.profileOwner.lastName}.
        </div>
      </span>
    );
  }
});

module.exports = UserProfileView;
