// Profile.js
import React from 'react'
import './index.css'

const Profile = ({profileDetails}) => (
  <div className="profile">
    <img src={profileDetails.imageUser} alt="profile" />
    <h1>{profileDetails.name}</h1>
    <p>{profileDetails.description}</p>
  </div>
)

export default Profile
