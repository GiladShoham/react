import React, { Component, PropTypes } from 'react';
import LocalSignIn from './local';

function bindValues(obj, that) {
  const out = {};
  for (const key in obj)
    out[key] = obj[key].bind(that);
  return out;
}

const LoginButtonsUI = ({ auth, showPopup, actions, apolloPassport }) => (
  <div id="login-buttons" className="login-buttons-dropdown-align-left">
    <div className="login-link-and-dropdown-list login-form-sign-in">
      <If condition={showPopup}>

        <div className="accounts-dialog">
          <a className="login-close-text" onClick={actions.close}>Close</a>
          <div className="login-close-text-clear"></div>

          <If condition={auth.data.userId}>

            <div className="login-button"
                id="login-buttons-open-change-password"
                onClick={actions.showChangePass}>
              Change password
            </div>

            <div className="login-button" id="login-buttons-logout" onClick={actions.logout}>
              Sign out
            </div>

          <Else />

            <If condition={false}>
            <div className="or">
              <span className="hline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className="or-text">or</span>
              <span className="hline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div>
            </If>
            <LocalSignIn auth={auth} apolloPassport={apolloPassport} />

          </If>

        </div>{/* .accounts-dialog */}

      <Else />

        <If condition={auth.data.userId}>

          <div onClick={actions.open}>
            {auth.data.userId} ▾
          </div>

        <Else />

          <a className="login-link-text" onClick={actions.open}>
            Sign in ▾
          </a>

        </If>

      </If>

    </div>
  </div>
);
LoginButtonsUI.propTypes = {
  auth: PropTypes.object,
  showPopup: PropTypes.bool,
  actions: PropTypes.object
};

const actions = {

  open() {
    this.setState({ showPopup: true });
  },

  close() {
    this.setState({ showPopup: false });
  },

  logout() {
    this.apolloPassport.logout();
  }

};

class LoginButtons extends Component {

  constructor({ apolloPassport }) {
    super();
    this.actions = bindValues(actions, this);
    this.apolloPassport = apolloPassport;

    this.state = {
      auth: apolloPassport.getState(),
      showPopup: false
    };

    this.apStateHandler = function apStateHandler(state) {
      this.setState({ auth: state });
    }.bind(this);

    apolloPassport.subscribe(this.apStateHandler);
  }

  componentWillUnmount() {
    this.apolloPassport.unsubscribe(this.apStateHandler);
  }

  render() {
    return (
      <LoginButtonsUI {...this.state} actions={this.actions} apolloPassport={this.apolloPassport} />
    );
  }

}

export { LoginButtons };