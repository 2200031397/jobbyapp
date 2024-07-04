import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Home extends Component {
  logout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    return (
      <div className="home-container">
        <header className="header">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/jobs">Jobs</Link>
            </li>
            <li>
              <button type="button" onClick={this.logout}>
                Logout
              </button>
            </li>
          </ul>
        </header>
        <div className="home-content">
          <h1>Find The Job That Fits Your Life</h1>
          <p>Millions of people are searching for jobs</p>
          <div>
            <Link to="/jobs">
              <button type="button">Find Jobs</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
