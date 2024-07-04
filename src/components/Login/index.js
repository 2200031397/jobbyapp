import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    message: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({message: errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, message} = this.state
    const jwtTokenUser = Cookies.get('jwt_token')
    if (jwtTokenUser !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bgLogin">
        <div className="flexingLogin">
          <div className="CenterLogo">
            <div className="LogoOfWebSiteLogin">
              <img
                className="webSiteLogoForLoginPage"
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
              />
            </div>
          </div>

          <form onSubmit={this.submitForm}>
            <div>
              <label htmlFor="UserName">USERNAME</label>
              <br />
              <input
                className="Input"
                id="UserName"
                type="text"
                placeholder="Username"
                onChange={this.onChangeUsername}
                value={username}
              />
            </div>

            <br />

            <div>
              <label htmlFor="PassWord">PASSWORD</label>
              <br />
              <input
                className="Input"
                type="password"
                id="PassWord"
                placeholder="Password"
                onChange={this.onChangePassword}
                value={password}
              />
            </div>

            <div>
              <button className="LoginButton" type="submit">
                Login
              </button>
            </div>
            <p className="message">{message}</p>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
