import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import AddTaskView from './AddTaskView';

export default connect(
  state => ({
    // user defined states & props
    userList: state.getIn(['authReducer', 'userList']),
    user: state.getIn(['authReducer', 'user']),
    colorList: state.getIn(['authReducer', 'colorList'])
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch)
    };
  }
)(AddTaskView);
