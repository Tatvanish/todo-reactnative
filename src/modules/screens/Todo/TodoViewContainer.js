import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import TodoView from './TodoView';

export default connect(
  state => ({
    // user defined states & props
    user: state.getIn(['authReducer', 'user']),
    todoList: state.getIn(['todoReducer', 'todoList'])
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch)
    };
  }
)(TodoView);
