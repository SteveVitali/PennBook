var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var NavigationBarView = require('./navigation-bar.jsx');
var PostStatusFormView = require('./post-status-form.jsx');
var NewsFeedItem = require('./news-feed-item.jsx');

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
      status: ''
    };
  },

  postStatus() {
    console.log('Posting status', this.state.status);
    // this.props.app.router.navigate('/profile/id/'')
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
            Online Friends
          </Col>
        </Row>
        </div>
      </span>
    );
  }
});

module.exports = NewsFeedView;
