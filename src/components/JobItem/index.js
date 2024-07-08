import React from 'react'
import {Link} from 'react-router-dom'
import './index.css'

const JobItem = ({job}) => (
  <li className="job-item">
    <Link to={`/jobs/${job.id}`} className="job-item-link">
      <div className="job-card">
        <h1>Description</h1>
        <img src={job.companyLogoUrl} alt="company logo" />
        <div>
          <h1>{job.title}</h1>
          <p>{job.rating}</p>
        </div>
        <p>{job.location}</p>
        <p>{job.packagePerAnnum}</p>
        <p>{job.employmentType}</p>
        <p>{job.jobDescription}</p>
      </div>
    </Link>
  </li>
)

export default JobItem
