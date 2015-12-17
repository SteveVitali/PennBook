var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var NavigationBarView = require('./navigation-bar.jsx');
var PostStatusFormView = require('./post-status-form.jsx');
var NewsFeedItem = require('./news-feed-item.jsx');
var Loader = require('react-loader');

var NewsFeedView = React.createClass({
  propTypes: {
    app: React.PropTypes.object.isRequired,
    appStore: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    Actions: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      status: '',
      cachedFriends: false,
      Friendships: this.props.appStore.getAll('Friendships'),
      actions: _.sortBy(this.props.Actions, function(action) {
        return -1 * (new Date(action.datetime)).getTime();
      })
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      status: '',
      cachedFriends: false,
      Friendships: nextProps.appStore.getAll('Friendships'),
      actions: _.sortBy(nextProps.Actions, function(action) {
        return -1 * (new Date(action.datetime)).getTime();
      })
    });
  },

  lazyLoadFriends() {
    if (this.state.cachedFriends) return true;

    var appStore = this.props.appStore;
    var friendships = this.state.Friendships;
    var userId = this.props.user._id;

    if (friendships.length === 0) return true;

    // Get all the ids of the uncached friends
    var uncachedUserIds = [];
    _.each(friendships, function(friendship) {
      var friendId = friendship.ownerId === userId
        ? friendship.friendId
        : friendship.ownerId;
      if (!appStore.get(friendId, 'Users')) {
        uncachedUserIds.push(friendId);
      }
    });
    // Now fetch them
    appStore.fetch(uncachedUserIds, 'Users', () => {
      this.setState({
        cachedFriends: true
      });
    });
  },

  lazyLoadRecommendations() {
    if (this.state.recommendations) return true;
    var userId = this.props.user._id;
    $.get('/api/users/' + userId + '/recommended-friends', (people) => {
      this.setState({
        recommendations: people
      });
    });
  },

  onStatusPost() {
    var userId = this.props.user._id;
    this.props.app.resetNewsFeed(userId, () => {
      this.props.app.render();
    });
  },

  render() {
    var Row = ReactBootstrap.Row;
    var Col = ReactBootstrap.Col;
    var Panel = ReactBootstrap.Panel;
    var Button = ReactBootstrap.Button;
    var Input = ReactBootstrap.Input;
    var userId = this.props.user._id;
    var appStore = this.props.appStore;
    var friendIds = {};
    return (
      <span>
        <NavigationBarView app={this.props.app}/>
        <div className='container'>
        <Row>
          <Col md={2}>
            <a href='/#profile'>View Profile</a>
            <br/>
            <a href='/#profile/edit'>Edit Profile</a>
          </Col>
          <Col md={8}>
            <PostStatusFormView app={this.props.app}
              onSubmit={this.onStatusPost}
              statusPoster={this.props.user}
              statusRecipient={this.props.user}
              appStore={this.props.appStore}/>
            { _.map(this.state.actions, (action, key) => {
              return (
                <NewsFeedItem action={action} key={key}
                  app={this.props.app}
                  appStore={this.props.appStore}/>
              );
            })}
          </Col>
          <Col md={2}>
            <p>
              <strong>Online Friends</strong>
            </p>
            <Loader loaded={this.lazyLoadFriends()} scale={0.8}>
              { _.compact(_.map(this.state.Friendships, (friendship) => {
                var friendId = friendship.ownerId === userId
                  ? friendship.friendId
                  : friendship.ownerId;
                var friend = appStore.get(friendId, 'Users') || {};
                if (!friend || friendIds[friend._id]) return;
                friendIds[friend._id] = true;
                if (friend.isLoggedIn) {
                  return (
                    <p>
                      <a href={'/#profile/id/' + friend._id}>
                        {friend.firstName + ' ' + friend.lastName + ' '}
                      </a>
                    </p>
                  );
                }
              }))}
            </Loader>
            <hr/>
            <p>
              <strong>People You May Know</strong>
            </p>
            <Loader loaded={this.lazyLoadRecommendations()} scale={0.8}>
              { _.map(this.state.recommendations, function(person) {
                return (
                  <p>
                    <a href={'/#profile/id/' + person._id}>
                      {person.firstName + ' ' + person.lastName + ' '}
                    </a>
                  </p>
                );
              })}
            </Loader>
          </Col>
        </Row>
        </div>
      </span>
    );
  }
});

module.exports = NewsFeedView;
