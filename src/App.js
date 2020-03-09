import { connect } from 'react-redux';
import App from './App.jsx';
import { calculateDimensions } from './store/actions';

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
  calculateDimensions,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
