var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var PostStatusFormView = React.createClass({
  propTypes: {
    app: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    appStore: React.PropTypes.object
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      status: ''
    };
  },

  postStatus: function(e) {
    console.log('Posting status', this.state.status);
  },

  render() {
    var Panel = ReactBootstrap.Panel;
    var Input = ReactBootstrap.Input;
    var Button = ReactBootstrap.Button;
    return (
      <Panel header='Update Status'>
        <Input type='textarea' placeholder="What's on your mind?"
          onChange={(e) => {
            this.setState({ status: e.target.value });
        }}/>
        <Button onClick={this.postStatus}>Post</Button>
      </Panel>
    );
  }
});

module.exports = PostStatusFormView;
