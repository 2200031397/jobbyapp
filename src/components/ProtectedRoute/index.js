import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = props => {
  const isAuthenticated = Cookies.get('jwt_token') !== undefined

  if (!isAuthenticated) {
    return <Redirect to="/login" />
  }

  return <Route {...props} />
}

export default ProtectedRoute
