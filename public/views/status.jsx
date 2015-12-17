var async = require('async');
var moment = require('moment');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Loader = require('react-loader');

var StatusView = React.createClass({
  propTypes: {
    app: React.PropTypes.object.isRequired,
    appStore: React.PropTypes.object.isRequired,
    status: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    var posterId = this.props.status.posterId;
    var recipientId = this.props.status.recipientId;
    return {
      poster: this.props.appStore.get(posterId, 'Users'),
      recipient: this.props.appStore.get(recipientId, 'Users')
    };
  },

  lazyLoadUsers() {
    if (this.state.poster && this.state.recipient) {
      return true;
    }
    var posterId = this.props.status.posterId;
    var recipientId = this.props.status.recipientId;
    var appStore = this.props.appStore;

    appStore.fetch([posterId, recipientId], 'Users', () => {
      this.setState({
        poster: appStore.get(posterId, 'Users'),
        recipient: appStore.get(recipientId, 'Users')
      });
    });
  },

  render() {
    var state = this.state;
    var props = this.props;

    var postedDate = new Date(props.status.datePosted);
    var timeSince = moment(postedDate).format('MMMM Do YYYY, h:mm:ss a');

    var extractName = (user) => {
      return user && [user.firstName, user.lastName].join(' ');
    };

    var recipientName = extractName(state.recipient);
    var posterName = extractName(state.poster);

    var recipientUrl = '/#profile/id/' + this.props.status.recipientId;
    var posterUrl = '/#profile/id/' + this.props.status.posterId;

    return (
      <span>
        <Loader loaded={this.lazyLoadUsers()} scale={0.8}>
          <p>
            <strong>
              <a href={posterUrl}>
                {posterName}
              </a>
              &#x25BA;
              <a href={recipientUrl}>
                {recipientName}
              </a>
            </strong>
            <br/>
            <span style={{ color: '#9197a3' }}>
              {timeSince}
            </span>
          </p>
          {this.props.status.content}
        </Loader>
      </span>
    );
  }
});

module.exports = StatusView;
