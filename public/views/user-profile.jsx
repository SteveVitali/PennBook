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
      actions: null,
      friendship: this.getProfileFriendship(),
      friendships: null
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      tabKey: nextProps.tabKey,
      profileOwner: nextProps.profileOwner,
      actions: null,
      friendship: this.getProfileFriendship(),
      friendships: null
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
    if (!this.lazyLoadUser()) return false;
    if (this.state.actions) return true;
    if (!this.state.friendship && !this.isOwnProfile()) return true;

    var userId = this.state.profileOwner._id;
    $.get('/api/users/' + userId + '/profile-feed', (actions) => {
      this.setState({
        actions: _.sortBy(actions, function(action) {
          return -1 * (new Date(action.datetime)).getTime();
        })
      });
    });
  },

  lazyLoadFriends() {
    if (this.state.friendships) return true;
    if (!this.state.profileOwner) return false;
    var userId = this.state.profileOwner._id;
    $.get('/api/users/' + userId + '/friendships', (friendships) => {
      this.props.app.initializeFriends(friendships, () => {
        this.setState({
          friendships: friendships
        });
      });
    });
  },

  isOwnProfile() {
    return this.state.profileOwner &&
           this.props.app.user._id === this.state.profileOwner._id;
  },

  getProfileFriendship() {
    var allFriends = this.props.appStore.getAll('Friendships');
    var profileId = this.props.profileOwnerId ||
                    this.props.profileOwner._id ||
                    this.state.profileOwner._id;
    var userId = this.props.user._id;

    // Return the friendship if one exists
    return _.find(allFriends, function(rel) {
      return (rel.ownerId === profileId && rel.friendId === userId) ||
             (rel.ownerId === userId && rel.friendId === profileId);
    });
  },

  unfriend() {
    var id = this.state.friendship._id;
    $.ajax({
      type: 'delete',
      url: '/api/friendships/' + id,
      success: () => {
        // Update appStore explicitly
        this.props.appStore.modelHash.Friendships.remove(id);
        this.setState({
          friendship: null
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  },

  addFriend() {
    $.ajax({
      type: 'post',
      url: '/api/friendships',
      data: {
        ownerId: this.props.user._id,
        friendId: this.state.profileOwner._id
      },
      success: (friendship) => {
        this.props.appStore.fetch([friendship._id], 'Friendships', () => {
          this.setState({
            friendship: friendship
          });
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  },

  render() {
    var Tabs = ReactBootstrap.Tabs;
    var Tab = ReactBootstrap.Tab;
    var Row = ReactBootstrap.Row;
    var Col = ReactBootstrap.Col;
    var Button = ReactBootstrap.Button;
    var buttonData = this.state.friendship
      ? { text: 'Unfriend', onClick: this.unfriend }
      : { text: 'Add Friend', onClick: this.addFriend };

    var profileUser = this.state.profileOwner || {};
    var appStore = this.props.appStore;
    var userIds = {};
    return (
      <span>
        <NavigationBarView app={this.props.app}/>
        <div className='container'>
          <Loader loaded={this.lazyLoadFeed()}>
            <Row>
              <Col xs={8} sm={8} md={8} lg={8}>
                <h3 style={{ marginTop: '-10px', marginBottom: '10px' }}>
                  {profileUser.firstName + ' ' + profileUser.lastName}
                </h3>
              </Col>
              <Col xs={4} sm={4} md={4} lg={4}>
                { !this.isOwnProfile() && (
                  <span style={{ float: 'right' }}>
                    <Button bsSize='small' onClick={buttonData.onClick}>
                      {buttonData.text}
                    </Button>
                  </span>
                )}
              </Col>
            </Row>
            <Tabs activeKey={this.state.tabKey}
              animation={false}
              onSelect={this.handleSelectTab}>
              { (!!this.state.friendship || this.isOwnProfile()) && (
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
              )}
              <Tab eventKey={2} title='About'>
                <br/>
                <UserProfileInfoView
                 app={this.props.app}
                 appStore={this.props.appStore}
                 user={this.props.user}
                 profileOwner={this.state.profileOwner}/>
              </Tab>
              <Tab eventKey={3} title='Friends'>
                <Loader loaded={this.lazyLoadFriends()}>
                  { _.compact(_.map(this.state.friendships, (friendship) => {
                    var friendId = friendship.ownerId === profileUser._id
                      ? friendship.friendId
                      : friendship.ownerId;
                    var friend = appStore.get(friendId, 'Users') || {};
                    if (!friend || userIds[friendId]) return;
                    userIds[friendId] = true;
                    return (
                      <p>
                        <a href={'#/profile/id/' + friendId}>
                          {friend.firstName + ' ' + friend.lastName}
                        </a>
                      </p>
                    );
                  }))}
                </Loader>
              </Tab>
            </Tabs>
          </Loader>
        </div>
      </span>
    );
  }
});

module.exports = UserProfileView;
