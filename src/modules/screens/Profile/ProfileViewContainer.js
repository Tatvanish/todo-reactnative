import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import ProfileView from './ProfileView';

export default connect(
  state => ({
    // user defined states & props
    user: state.getIn(['authReducer', 'user'])
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch)
    };
  }
)(ProfileView);
