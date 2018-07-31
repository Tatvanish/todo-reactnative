import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import AddTaskView from './AddTaskView';

export default connect(
  state => ({
    // user defined states & props
    user: state.getIn(['authReducer', 'user']),
    colorList: state.getIn(['todoReducer', 'colorList'])
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch)
    };
  }
)(AddTaskView);
