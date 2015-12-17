var moment = require('moment');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Loader = require('react-loader');

var CommentView = React.createClass({
  propTypes: {
    app: React.PropTypes.object.isRequired,
    appStore: React.PropTypes.object.isRequired,
    parent: React.PropTypes.object.isRequired,
    comment: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    var commenterId = this.props.comment.commenterId;
    var commenter = this.props.appStore.get(commenterId, 'Users');
    return {
      commenter: commenter
    };
  },

  lazyLoadCommenter() {
    if (this.state.commenter) return true;
    var appStore = this.props.appStore;
    var commenterId = this.props.comment.commenterId;
    appStore.fetch([commenterId], 'Users', () => {
      this.setState({
        commenter: appStore.get(commenterId, 'Users')
      });
    });
  },

  render() {
    var commenter = this.state.commenter || {};
    var postedDate = new Date(this.props.comment.datePosted);
    var timeSince = moment(postedDate).format('MMMM Do YYYY, h:mm:ss a');
    return (
      <Loader loaded={this.lazyLoadCommenter()} scal={0.4}>
        <strong>
          <a href={'/#profile/id/' + commenter._id}>
            {commenter.firstName + ' ' + commenter.lastName + ' '}
          </a>
        </strong>
        {this.props.comment.content}
        <br/>
        <span style={{ color: '#9197a3' }}>
          {timeSince}
        </span>
      </Loader>
    );
  }
});

module.exports = CommentView;
