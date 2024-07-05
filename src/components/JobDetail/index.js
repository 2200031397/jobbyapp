import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

class JobDetail extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    isLoading: true,
    isError: false,
  }

  componentDidMount() {
    this.fetchJobDetails()
  }

  fetchJobDetails = async () => {
    this.setState({isLoading: true, isError: false})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const data = await response.json()
        this.setState({
          jobDetails: data.job_details,
          similarJobs: data.similar_jobs,
          isLoading: false,
        })
      } else {
        throw new Error('Failed to fetch job details')
      }
    } catch (error) {
      console.error('Error fetching job details:', error)
      this.setState({isLoading: false, isError: true})
    }
  }

  handleRetry = () => {
    this.fetchJobDetails()
  }

  handleViewJob = jobId => {
    const {history} = this.props
    history.push(`/jobs/${jobId}`)
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.handleRetry}>
        Retry
      </button>
    </div>
  )

  renderJobDetails = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      company_logo_url: companyLogoUrl,
      company_website_url: companyWebsiteUrl,
      employment_type: employmentType,
      job_description: jobDescription,
      location,
      package_per_annum: packagePerAnnum,
      rating,
      skills,
      life_at_company: lifeAtCompany,
    } = jobDetails

    return (
      <div className="job-details-container">
        <header className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
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
        <div className="job-details">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="company-logo"
          />
          <div className="job-info">
            <h1>{jobDetails.title}</h1>
            <div className="job-details-info">
              <p>{location}</p>
              <p>{employmentType}</p>
              <p>{packagePerAnnum}</p>
              <p>{rating}</p>
            </div>
          </div>
          <div className="description-container">
            <h1>Description</h1>
            <p>{jobDescription}</p>
          </div>
          {skills && (
            <div className="skills-container">
              <h2>Skills</h2>
              <ul className="skills-list">
                {skills.map(skill => (
                  <li key={skill.name} className="skill-item">
                    <img src={skill.image_url} alt={skill.name} />
                    <p>{skill.name}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="life-at-company">
            <h2>Life at Company</h2>
            <p>{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.image_url} alt="life at company" />
          </div>
          <a href={companyWebsiteUrl} target="_blank" rel="noopener noreferrer">
            Visit
          </a>
        </div>
        <div className="similar-jobs-container">
          <h2>Similar Jobs</h2>
          <ul className="similar-jobs-list">
            {similarJobs.map(similarJob => (
              <li key={similarJob.id} className="similar-job-item">
                <img
                  src={similarJob.company_logo_url}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <h3>{similarJob.title}</h3>
                <p>{similarJob.location}</p>
                <p>{similarJob.employment_type}</p>
                <p>{similarJob.package_per_annum}</p>
                <p>{similarJob.rating}</p>
                <h1>Description</h1>
                <p>{similarJob.job_description}</p>{' '}
                {/* Added job_description here */}
                <button
                  type="button"
                  onClick={() => this.handleViewJob(similarJob.id)}
                >
                  View Job
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    const {isLoading, isError} = this.state
    if (isLoading) {
      return this.renderLoader()
    }
    if (isError) {
      return this.renderFailureView()
    }
    return this.renderJobDetails()
  }
}

export default JobDetail
