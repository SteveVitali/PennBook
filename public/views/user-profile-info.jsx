var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var FormGenerator = require('form-generator-react');
var utils = require('../utils');

var UserProfileInfoView = React.createClass({
  propTypes: {
    profileOwner: React.PropTypes.object,
    user: React.PropTypes.object.isRequired,
    tabKey: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      tabKey: 1
    };
  },

  getInitialState() {
    return {
      tabKey: this.props.tabKey || 1
    };
  },

  handleSelectTab(key) {
    this.setState({
      tabKey: key
    });
  },

  updateUser(updateObj) {
    console.log('updating user with updateObj', updateObj);
  },

  updateUserInfo(updateObj) {
    updateObj.birthdate = new Date(
      updateObj.birthdate.year,
      this.months.indexOf(updateObj.birthdate.month),
      updateObj.birthdate.day
    );
    this.updateUser(updateObj);
  },

  months: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],

  render() {
    var Panel = ReactBootstrap.Panel;
    var Tabs = ReactBootstrap.Tabs;
    var Tab = ReactBootstrap.Tab;
    var Row = ReactBootstrap.Row;
    var Col = ReactBootstrap.Col;

    var user = this.props.user;
    var birthdate = new Date(user.birthdate);

    console.log(user);

    var basicInfoForm = FormGenerator.create({
      firstName: {
        type: String,
        label: 'First Name',
        isRequired: true,
        defaultValue: user.firstName
      },
      lastName: {
        type: String,
        label: 'Last Name',
        isRequired: true,
        defaultValue: user.lastName
      },
      'email': {
        type: String,
        label: 'Email',
        isRequired: true,
        validate: FormGenerator.validators.regex(utils.emailRegex),
        defaultValue: user.email
      },
      'gender': {
        type: String,
        enum: ['male', 'female', 'other'],
        label: 'Gender',
        defaultValue: user.gender
      },
      'birthdate': {
        type: {
          month: {
            type: String,
            enum: this.months,
            label: 'Month',
            defaultValue: this.months[birthdate.getMonth()]
          },
          day: {
            type: Number,
            enum: _.map(Array(31), function(value, index) {
              return index + 1;
            }),
            label: 'Day',
            defaultValue: birthdate.getDate()
          },
          year: {
            type: Number,
            enum: _.map(Array(100), function(value, index) {
              return index + 1916;
            }),
            label: 'Year',
            defaultValue: birthdate.getYear()
          }
        },
        label: 'Birthday'
      }
    }, 'basicInfoForm', this.updateUserInfo, true);

    var workAndEducationForm = FormGenerator.create({
      school: {
        type: String,
        label: 'School',
        defaultValue: user.school
      },
      work: {
        type: String,
        label: 'Work',
        defaultValue: user.work
      },
      interests: {
        type: [String],
        label: 'Interests',
        defaultValue: user.interests
      }
    }, 'workAndEducationForm', this.updateUser, true);

    return (
      <Panel header='About'>
        <Tabs activeKey={this.state.tabKey} position='left'
          tabWidth={3}
          animation={false}
          onSelect={this.handleSelectTab}>
          <Tab eventKey={1} title='Contact and Basic Info'>
            {basicInfoForm}
          </Tab>
          <Tab eventKey={2} title='Work and Education'>
            {workAndEducationForm}
          </Tab>
        </Tabs>
      </Panel>
    );
  }
});

module.exports = UserProfileInfoView;
