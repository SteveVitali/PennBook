var $ = require('jquery');
require('jquery-ui');
var React = require('react');

var AutoCompleteInput = React.createClass({
  propTypes: {
    endpoint: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    label: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onUpdate: React.PropTypes.func,
    style: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      value: '',
      label: '',
      placeholder: '',
      style: {},
      onChange: () => {},
      onUpdate: () => {}
    };
  },

  getInitialState() {
    return {
      selectedItem: undefined,
      value: this.props.value
    };
  },

  onChange(e) {
    this.setState({
      value: e.target.value
    });
    this.props.onChange(e);
  },

  onUpdate(selectedItem) {
    this.setState({
      selectedItem: selectedItem
    });
    this.props.onUpdate(selectedItem);
  },

  componentDidMount() {
    var input = this.refs.autocompleteElement.getDOMNode();
    $(input).autocomplete({
      minLength: 2,
      delay: 200,
      source: (request, response) => {
        var url = this.props.endpoint + '/' + this.state.value;
        $.get(url, function(data) {
          response(data);
        });
      },
      select: (event, ui) => {
        this.onUpdate(ui.item.data);
      },
      open: (event, ui) => {
        $('.ui-autocomplete').css('z-index', 100000);
      }
    });
  },

  render: function() {
    return (
      <div className='form-group' style={this.props.style}>
        <label className='control-label'>
          {this.props.label || ''}
        </label>
        <input className='form-control'
          type='text'
          ref='autocompleteElement'
          value={this.state.value}
          onChange={this.onChange}
          autofocus={true}
          label={this.props.label}
          placeholder={this.props.placeholder}/>
      </div>
    );
  }
});

module.exports = AutoCompleteInput;
