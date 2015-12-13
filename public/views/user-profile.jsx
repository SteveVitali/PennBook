var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Loader = require('react-loader');
var NavigationBarView = require('./navigation-bar.jsx');
var UserProfileInfoView = require('./user-profile-info.jsx');
var PostStatusFormView = require('./post-status-form.jsx');

var UserProfileView = React.createClass({
  propTypes: {
    app: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    appStore: React.PropTypes.object,
    profileOwner: React.PropTypes.object,
    profileOwnerId: React.PropTypes.string,
    tabKey: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      tabKey: 1
    };
  },

  getInitialState() {
    return {
      tabKey: this.props.tabKey || 1,
      profileOwner: this.props.profileOwner
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      tabKey: nextProps.tabKey,
      profileOwner: nextProps.profileOwner
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

  lazyLoadUser: function() {
    if (this.state.profileOwner) return true;

    var userId = this.props.profileOwnerId;
    this.props.appStore.fetch([userId], 'Users', () => {
      this.setState({
        profileOwner: this.props.appStore.getModel(userId, 'Users')
      });
    });
  },

  render() {
    var Tabs = ReactBootstrap.Tabs;
    var Tab = ReactBootstrap.Tab;

    return (
      <span>
        <NavigationBarView app={this.props.app}/>
        <div className='container'>
          <Loader loaded={this.lazyLoadUser()}>
            <Tabs activeKey={this.state.tabKey}
              animation={false}
              onSelect={this.handleSelectTab}>
              <Tab eventKey={1} title='Timeline'>
                <PostStatusFormView app={this.props.app}
                  statusPoster={this.props.user}
                  statusRecipient={this.state.profileOwner}
                  appStore={this.props.appStore}/>
              </Tab>
              <Tab eventKey={2} title='About'>
                <br/>
                <UserProfileInfoView
                 app={this.props.app}
                 appStore={this.props.appStore}
                 user={this.props.user}
                 profileOwner={this.state.profileOwner}/>
              </Tab>
              <Tab eventKey={3} title='Friends'>
                Friends
              </Tab>
            </Tabs>
          </Loader>
        </div>
      </span>
    );
  }
});

module.exports = UserProfileView;
