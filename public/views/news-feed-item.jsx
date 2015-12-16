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
    itemId: React.PropTypes.object
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
      item: initialItem
    };
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
    var itemType = this.props.app.pluralizeModel(
      this.state.action.actionType
    );

    var itemId = this.state.action.actionId;
    var appStore = this.props.appStore;
    appStore.fetch([itemId], itemType, () => {
      this.setState({
        item: appStore.getModel(itemId, itemType)
      });
    });
  },

  lazyLoadComments() {

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

  render() {
    var Panel = ReactBootstrap.Panel;
    var Table = ReactBootstrap.Table;

    return (
      <Panel>
        <Loader loaded={this.lazyLoadItem()} scale={0.8}>
          {this.getActionView()}
        </Loader>

        <Loader loaded={!this.lazyLoadComments()} scale={0.8}>
          <br/>
          <Table condensed>
            <tbody>
              { _.map(this.state.comments || ['a', 'b'], (comment) => {
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
            </tbody>
          </Table>
        </Loader>
      </Panel>
    );
  }
});

module.exports = NewsFeedItem;
