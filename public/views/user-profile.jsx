var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Loader = require('react-loader');
var NavigationBarView = require('./navigation-bar.jsx');
var UserProfileInfoView = require('./user-profile-info.jsx');
var PostStatusFormView = require('./post-status-form.jsx');
var NewsFeedItem = require('./news-feed-item.jsx');

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
    var initialOwner = this.props.profileOwner;
    var initialOwnerId = this.props.profileOwnerId;
    if (!initialOwner && initialOwnerId) {
      // Get initial owner from cache if possible
      initialOwner = this.props.appStore.get(initialOwnerId, 'Users');
    }
    return {
      tabKey: this.props.tabKey || 1,
      profileOwner: initialOwner,
      actions: null
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      tabKey: nextProps.tabKey,
      profileOwner: nextProps.profileOwner
    });
  },

  handleSelectTab(key) {
    if (this.isOwnProfile()) {
      this.props.app.router.navigate(
        key === 2 ? '/profile/edit' : '/profile'
      );
    }
    this.setState({
      tabKey: key
    });
  },

  lazyLoadUser() {
    if (this.state.profileOwner) return true;
    var userId = this.props.profileOwnerId;
    this.props.appStore.fetch([userId], 'Users', () => {
      this.setState({
        profileOwner: this.props.appStore.getModel(userId, 'Users')
      });
    });
  },

  lazyLoadFeed() {
    console.log('lazy load feed', this.state.actions);
    if (!this.lazyLoadUser()) return false;
    if (this.state.actions) return true;
    var userId = this.state.profileOwner._id;
    $.get('/api/users/' + userId + '/profile-feed', (actions) => {
      this.setState({
        actions: actions
      });
    });
  },

  isOwnProfile() {
    return this.state.profileOwner &&
           this.props.app.user._id === this.state.profileOwner._id;
  },

  render() {
    var Tabs = ReactBootstrap.Tabs;
    var Tab = ReactBootstrap.Tab;

    return (
      <span>
        <NavigationBarView app={this.props.app}/>
        <div className='container'>
          <Loader loaded={this.lazyLoadFeed()}>
            <Tabs activeKey={this.state.tabKey}
              animation={false}
              onSelect={this.handleSelectTab}>
              <Tab eventKey={1} title='Timeline'>
                <PostStatusFormView app={this.props.app}
                  statusPoster={this.props.user}
                  statusRecipient={this.state.profileOwner}
                  appStore={this.props.appStore}/>
                { _.map(this.state.actions, (action, key) => {
                  return (
                    <NewsFeedItem action={action} key={key}
                      app={this.props.app}
                      appStore={this.props.appStore}/>
                  );
                })}
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
