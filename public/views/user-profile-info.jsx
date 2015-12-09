var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var UserProfileInfoView = React.createClass({
  propTypes: {
    profileOwner: React.PropTypes.object,
    user: React.PropTypes.object.isRequired,
    tabKey: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      tabKey: 1
    };
  },

  getInitialState() {
    return {
      tabKey: this.props.tabKey || 1
    };
  },

  handleSelectTab(key) {
    this.setState({
      tabKey: key
    });
  },

  render() {
    var Panel = ReactBootstrap.Panel;
    var Tabs = ReactBootstrap.Tabs;
    var Tab = ReactBootstrap.Tab;
    var Row = ReactBootstrap.Row;
    var Col = ReactBootstrap.Col;

    return (
      <Panel header='About'>
        <Tabs activeKey={this.state.tabKey} position='left'
          tabWidth={3}
          animation={false}
          onSelect={this.handleSelectTab}>
          <Tab eventKey={1} title='Overview'>
            
          </Tab>
          <Tab eventKey={2} title='Work and Education'>
            Work and Education
          </Tab>
          <Tab eventKey={3} title='Contact and Basic Info'>
            Contact and basic info
          </Tab>
        </Tabs>
      </Panel>
    );
  }
});

module.exports = UserProfileInfoView;
