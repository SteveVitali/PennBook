var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var NavigationBarView = require('./navigation-bar.jsx');
var UserProfileInfoView = require('./user-profile-info.jsx');
var PostStatusFormView = require('./post-status-form.jsx');

var UserProfileView = React.createClass({
  propTypes: {
    app: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    appStore: React.PropTypes.object,
    profileOwner: React.PropTypes.object,
    lazyLoadWithUserId: React.PropTypes.string,
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

  componentWillReceiveProps(nextProps) {
    console.log('receiving dem props');
    this.setState({
      tabKey: nextProps.tabKey
    });
  },

  handleSelectTab(key) {
    this.props.app.router.navigate(
      key === 2 ? '/profile/edit' : '/profile'
    );
    this.setState({
      tabKey: key
    });
  },

  render() {
    var Tabs = ReactBootstrap.Tabs;
    var Tab = ReactBootstrap.Tab;
    return (
      <span>
        <NavigationBarView app={this.props.app}/>
        <div className='container'>
          <Tabs activeKey={this.state.tabKey}
            animation={false}
            onSelect={this.handleSelectTab}>
            <Tab eventKey={1} title='Timeline'>
              <PostStatusFormView app={this.props.app}
                user={this.props.user}
                appStore={this.props.appStore}/>
            </Tab>
            <Tab eventKey={2} title='About'>
              <br/>
              <UserProfileInfoView
                app={this.props.app}
                appStore={this.props.appStore}
                user={this.props.user}
                profileOwner={this.props.profileOwner}/>
            </Tab>
            <Tab eventKey={3} title='Friends'>
              Friends
            </Tab>
          </Tabs>
        </div>
      </span>
    );
  }
});

module.exports = UserProfileView;
