var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');

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
              <div className='form-group'>
                <Input type='text' placeholder='Search'
                  onChange={(e) => {
                    this.setState({ searchTerm: e.target.value });
                  }}
                  onKeyPress={(e) => {
                    if (event.keyCode === 13) {
                      this.search(this.state.searchTerm);
                    }
                }}/>
              </div>
            </form>
            <ul className='nav navbar-nav navbar-right'>
              <NavDropdown title='Settings'>
                <MenuItem href='/#profile'>View Profile</MenuItem>
                <MenuItem href='/#profile/edit'>Edit Profile</MenuItem>
                <MenuItem divider />
                <MenuItem href='/#logout'>Log Out</MenuItem>
              </NavDropdown>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = NavigationBarView;
