import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import LoginView from './LoginView';

export default connect(
  state => ({
    // user defined states & props
    user: state.getIn(['authReducer', 'user']),
    userList: state.getIn(['authReducer', 'userList']),
    isLoggedIn: state.getIn(['authReducer', 'isLoggedIn']),
    loading: state.getIn(['authReducer', 'loading']),
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch)
    };
  }
)(LoginView);
