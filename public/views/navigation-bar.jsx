var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var AutoCompleteInput = require('./auto-complete-input.jsx');

var NavigationBarView = React.createClass({
  propTypes: {
    app: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      searchTerm: ''
    };
  },

  search(searchTerm) {
    console.log('Searching for', searchTerm);
  },

  logout() {
    $.post('/logout', () => {
      this.props.app.login();
    });
  },

  selectUserFromSearchOptions(data) {
    console.log('selected', data, 'from search options');
    this.props.app.router.navigate(
      '/profile/id/' + data._id,
      { trigger: true }
    );
  },

  render() {
    var Input = ReactBootstrap.Input;
    var NavDropdown = ReactBootstrap.NavDropdown;
    var MenuItem = ReactBootstrap.MenuItem;

    return (
      <nav className='navbar navbar-inverse navbar-static-top'>
        <div className='container'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle collapsed'
              data-toggle='collapse'
              data-target='#navbar'
              aria-expanded='false'
              aria-controls='navbar'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>
            <a className='navbar-brand' href='#'>Project name</a>
          </div>
          <div id='navbar' className='navbar-collapse collapse'>
            <form className='navbar-form navbar-left'>
              <AutoCompleteInput
                endpoint='/users/regex-search'
                placeholder='Search'
                onUpdate={this.selectUserFromSearchOptions}
                onChange={(e) => {
                  this.setState({ searchTerm: e.target.value });
                }}
                onKeyPress={(e) => {
                  if (event.keyCode === 13) {
                    this.search(this.state.searchTerm);
                  }
              }}/>
            </form>
            <ul className='nav navbar-nav navbar-right'>
              <NavDropdown title='Settings'>
                <MenuItem href='/#profile'>View Profile</MenuItem>
                <MenuItem href='/#profile/edit'>Edit Profile</MenuItem>
                <MenuItem divider/>
                <MenuItem onSelect={this.logout}>Log Out</MenuItem>
              </NavDropdown>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = NavigationBarView;
