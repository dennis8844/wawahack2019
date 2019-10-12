import React, { Component } from 'react';
import { Route, HashRouter, Link, Redirect, Switch } from 'react-router-dom';


//import { createBrowserHistory } from "history";
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Dashboard from './protected/Dashboard';
import { logout } from '../helpers/auth';
import { firebaseAuth } from '../config/constants';
import withWidth from '@material-ui/core/withWidth';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Modal from '@material-ui/core/Modal';
import ModalBase from '../components/Modals/ModalBase';
// import { withRouter } from "react-router";
// import { createBrowserHistory } from "history";
// consumers & contexts
import { SnackbarProvider } from 'material-ui-snackbar-provider'

//var hist = createBrowserHistory();

function PrivateRoute({ component: Component, authed, width, openModal, closeModal, ...rest }) {
    return (
    <Route
      {...rest}
      render={props =>

        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )}
    />
  );
}

function PublicRoute({ component: Component, authed, openModal, width, closeModal, ...rest }) {
    const widthText = 'xs--sm';
    console.log(width);
    const isMobile = widthText.indexOf(width) > -1;
    console.log(isMobile);
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? (
          <Component {...props}  />
        ) : isMobile ?  (
            <Redirect to="/mobile"  />
        ) : (
          <Redirect to="/dashboard" />
        )}
    />
  );
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authed: false,
            viewLoading: true,
            imageLoading: false,
            showModal: false,
            modalType: ''
        };
    }

  componentDidMount = () => {
    this.removeListener = firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authed: true,
          viewLoading: false,
            showModal: false,
            modalType: ''
        });
      } else {
        this.setState({
          authed: false,
            viewLoading: false,
            showModal: false,
            modalType: ''
        });
      }
    });
  }

  componentWillUnmount = () => {
    this.removeListener();
  }

  handleOpen = (e, type) => {
        if (e) {
            this.setState({ showModal: true, modalType: type });
        }
    };

  handleClose = (e) => {
        if (e) {
            this.setState({ showModal: false, modalType: '' });
        }
    };

  renderModal = (type, close, authed) => {
      return (<ModalBase modalType={type} authed={authed} close={close} />);

  }

  render() {
      console.log(this.props);
    const authButtons = this.state.authed ? (
      <FlatButton
        label="Logout"
        onClick={() => {
          logout();
        }}
        style={{ color: '#fff' }}
      />
    ) : (
      <span>
        <Link to="/login">
          <FlatButton label="Login" style={{ color: '#fff' }} />
        </Link>
        {/*<Link to="/register">*/}
          {/*<FlatButton label="Register" style={{ color: '#fff' }} />*/}
        {/*</Link>*/}
      </span>
    );

    const topbarButtons = (
      <div>
        {/*<Link to="/">*/}
          {/*<FlatButton label="Home" style={{ color: '#fff' }} />*/}
        {/*</Link>*/}
        {/*<Link to="/dashboard">*/}
          {/*<FlatButton label="dashboard" style={{ color: '#fff' }} />*/}
        {/*</Link>*/}
        {authButtons}
      </div>
    );

    const nonMobileSnackAnchor = { vertical: 'top', horizontal: 'right' };
    const mobileSnackAnchor = { vertical: 'bottom', horizontal: 'center' };

    return (
        <div>
            <SnackbarProvider SnackbarProps={{
                autoHideDuration: 4000,
                anchorOrigin: this.props.width === 'xs' || this.props.width === 'sm' ? mobileSnackAnchor : nonMobileSnackAnchor
            }}>
            {this.state.viewLoading === true ? <h1>Loading</h1> : <HashRouter>
                <div>
                    {! this.state.authed && <AppBar
                        title="Wawa Quick Order"
                        style={{backgroundColor: '#b48b69'}}
                        iconElementRight={topbarButtons}
                        iconStyleRight={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '0'
                        }}
                    />}
                    <div className="container d-flex justify-content-center mt-3">
                        <div className="row">
                            <Switch>
                                <Route path="/" exact component={Home}/>
                                <PublicRoute
                                    authed={this.state.authed}
                                    path="/login"
                                    component={Login}
                                    openModal={this.handleOpen}
                                    closeModal={this.handleClose}
                                    width={this.props.width}
                                />
                                <PublicRoute
                                    authed={this.state.authed}
                                    path="/register"
                                    component={Register}
                                    openModal={this.handleOpen}
                                    closeModal={this.handleClose}
                                    width={this.props.width}
                                />
                                <PrivateRoute
                                    authed={this.state.authed}
                                    path="/dashboard"
                                    width={this.props.width}
                                    component={(props) => <Dashboard openModal={this.handleOpen}
                                        closeModal={this.handleClose} />
                                    }
                                />
                                <PrivateRoute
                                    authed={this.state.authed}
                                    path="/mobileview"
                                    width={this.props.width}
                                    component={(props) => <Dashboard openModal={this.handleOpen}
                                                                     closeModal={this.handleClose} />
                                    }
                                />
                                <Route render={() => <h3>No Match</h3>}/>
                            </Switch>
                        </div>
                    </div>
                </div>
            </HashRouter>
            }
            {this.state.authed && <FlatButton
                label="Logout"
                onClick={() => {
                    logout();
                }}
                style={{
                    color: '#b48b69',
                    position: 'fixed',
                    bottom: 0,
                    left: 0
                }}
            />}
            <Modal
                open={this.state.showModal}
                handleClose={this.handleClose}
                authed={this.state.authed}
                scroll='paper'
                id="modal-container"
                style={{display: 'flex'}}
                onBackdropClick={(e) => {this.handleClose(e)}}
                onEscapeKeyDown={(e) => {this.handleClose(e)}}
            >
                {this.renderModal(this.state.modalType, this.handleClose, this.state.authed)}

            </Modal>

            </SnackbarProvider>
        </div>
    );
  }
}

export default withWidth()(App);
