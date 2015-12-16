var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Loader = require('react-loader');
var StatusView = require('./status.jsx');
var CommentView = require('./comment.jsx');

var NewsFeedItem = React.createClass({
  propTypes: {
    app: React.PropTypes.object.isRequired,
    appStore: React.PropTypes.object.isRequired,
    // The idea here is that from the actionId,
    // we can lazy load the Action object, and from
    // that, we can lazy load the actual news feed
    // item itself (a Status, Friendship, etc.).
    // However, we are flexible with what initial
    // data you can give to the component as props.
    action: React.PropTypes.object,
    actionId: React.PropTypes.string,
    item: React.PropTypes.object,
    itemId: React.PropTypes.object,
    comments: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    var props = this.props;
    // If the action object is passed in, use it.
    // Otherwise, check the cache in case action is already loaded.
    var initialAction = props.action
      ? props.action
      : (props.actionId && props.appStore.get(props.actionId, 'Actions'));

    // If the item object is passed in, user it.
    // Otherwise, if the action object is populated,
    // check the cache for an item of that type
    var initialItem = props.item;
    if (initialAction && !initialItem) {
      var itemType = props.app.pluralizeModel(initialAction.actionType);
      initialItem = props.itemId && props.appStore(props.itemId, itemType);
    }
    return {
      action: initialAction,
      item: initialItem,
      comments: props.comments,
      comment: ''
    };
  },

  itemType() {
    return this.state.action && this.state.action.actionType;
  },

  pluralItemType() {
    return this.props.app.pluralizeModel(this.itemType());
  },

  lazyLoadAction() {
    if (this.state.action || this.props.itemId || this.state.item) {
      return true;
    }
    var actionId = this.props.actionId;
    var appStore = this.props.appStore;
    appStore.fetch([actionId], 'Actions', () => {
      this.setState({
        action: appStore.getModel(actionId, 'Actions')
      });
    });
  },

  lazyLoadItem() {
    if (!this.lazyLoadAction()) return false;
    if (this.state.item) return true;

    // Get plural form of action type
    var itemType = this.pluralItemType();

    var itemId = this.state.action.actionId;
    var appStore = this.props.appStore;
    appStore.fetch([itemId], itemType, () => {
      this.setState({
        item: appStore.getModel(itemId, itemType)
      });
    });
  },

  lazyLoadComments() {
    if (this.state.comments) return true;
    if (!this.state.item) return false;

    var itemType = this.pluralItemType().toLowerCase();
    var itemId = this.state.item._id;

    $.get('/api/item/' + itemId + '/comments', (comments) => {
      comments.length && console.log('Fetched comments', comments);
      this.setState({
        comments: comments
      });
    });
  },

  getActionView() {
    var actionType = (this.state.action || {}).actionType;
    switch (actionType) {
      case 'Status': return (
        <StatusView app={this.props.app}
          appStore={this.props.appStore}
          status={this.state.item}/>
      );
      default: return null;
    }
  },

  postComment(comment) {
    $.ajax({
      type: 'post',
      url: '/api/comments',
      data: {
        parentId: this.state.item._id,
        content: comment
        // Other fields will be filled in on server
      },
      success: (comment) => {
        console.log('created comment', comment);
        this.setState({
          comments: null
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  },

  render() {
    var Panel = ReactBootstrap.Panel;
    var Table = ReactBootstrap.Table;
    var Input = ReactBootstrap.Input;
    return (
      <Panel className='post-panel'>
        <Loader loaded={this.lazyLoadItem()} scale={0.8}>
          {this.getActionView()}
        </Loader>

        <Loader loaded={this.lazyLoadComments()} scale={0.8}>
          <br/>
          <Table condensed>
            <tbody>
              { _.map(this.state.comments, (comment) => {
                return (
                  <tr>
                    <td>
                      <CommentView comment={comment}
                        parent={this.state.item}
                        app={this.props.app}
                        appStore={this.props.appStore}/>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td>
                  <Input type='text' bsSize='small'
                    placeholder='Write a comment...'
                    value={this.state.value}
                    onChange={(e) => {
                      this.setState({ comment: e.target.value });
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        var comment = this.state.comment;
                        comment && this.postComment(comment);
                      }
                    }}/>
                </td>
              </tr>
            </tbody>
          </Table>
        </Loader>
      </Panel>
    );
  }
});

module.exports = NewsFeedItem;
