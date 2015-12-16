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
    Actions: React.PropTypes.arrayOf(React.PropTypes.object),
    Friendships: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      status: '',
      cachedFriends: false
    };
  },

  lazyLoadFriends() {
    if (this.state.cachedFriends) return true;

    var appStore = this.props.appStore;
    var friendships = this.props.Friendships;
    var userId = this.props.user._id;

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

  render() {
    console.log('this.props', this.props);
    var Row = ReactBootstrap.Row;
    var Col = ReactBootstrap.Col;
    var Panel = ReactBootstrap.Panel;
    var Button = ReactBootstrap.Button;
    var Input = ReactBootstrap.Input;
    var userId = this.props.user._id;
    var appStore = this.props.appStore;
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
              statusPoster={this.props.user}
              statusRecipient={this.props.user}
              appStore={this.props.appStore}/>
            { _.map(this.props.Actions, (action, key) => {
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
              { _.compact(_.map(this.props.Friendships, (friendship) => {
                var friendId = friendship.ownerId === userId
                  ? friendship.friendId
                  : friendship.ownerId;
                var friend = appStore.get(friendId, 'Users') || {};
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
          </Col>
        </Row>
        </div>
      </span>
    );
  }
});

module.exports = NewsFeedView;
