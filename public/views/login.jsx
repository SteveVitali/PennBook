var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var LoginView = React.createClass({
  render() {
    var Nav = ReactBootstrap.Nav;
    var Navbar = ReactBootstrap.Navbar;
    var NavItem = ReactBootstrap.NavItem;
    var NavBrand = ReactBootstrap.NavBrand;
    var Button = ReactBootstrap.Button;
    var Input = ReactBootstrap.Input;

    return (
      <Navbar inverse toggleNavKey={0}>
        <NavBrand>PennBook</NavBrand>
        <Nav right eventKey={0}>
          <form className='navbar-form' action="">
            <Input type='text' placeholder='email' />
            <Input type='text' placeholder='password' />
            <Button bsStyle='success' type='submit'>Sign in</Button>
          </form>
        </Nav>
      </Navbar>
    );
  }
});

module.exports = LoginView;
