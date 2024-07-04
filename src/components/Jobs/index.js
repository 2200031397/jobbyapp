// Jobs.js
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Profile from '../Profile'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    jobs: [],
    profileDetails: {},
    loading: true,
    profileLoading: true,
    error: '',
    profileError: '',
    search: '',
    employmentType: [],
    salaryRange: '',
  }

  componentDidMount() {
    this.fetchProfile()
    this.fetchJobs()
  }

  fetchProfile = async () => {
    this.setState({profileLoading: true})
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt_token')}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.setState({
        profileDetails: {
          name: data.profile_details.name,
          description: data.profile_details.short_bio,
          imageUser: data.profile_details.profile_image_url,
          CheckingProfileData: 'success',
        },
        profileLoading: false,
      })
    } else {
      this.setState({
        profileError: 'Failed to fetch profile',
        profileLoading: false,
      })
    }
  }

  fetchJobs = async () => {
    this.setState({loading: true})
    const {search, employmentType, salaryRange} = this.state
    const employmentTypeString = employmentType.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeString}&minimum_package=${salaryRange}&search=${search}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt_token')}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const camelCaseJobs = data.jobs.map(job => ({
        id: job.id,
        title: job.title,
        companyLogoUrl: job.company_logo_url,
        location: job.location,
        rating: job.rating,
        packagePerAnnum: job.package_per_annum,
        employmentType: job.employment_type,
        jobDescription: job.job_description,
      }))
      this.setState({jobs: camelCaseJobs, loading: false})
    } else {
      this.setState({error: 'Failed to fetch jobs', loading: false})
    }
  }

  handleSearch = () => {
    this.fetchJobs()
  }

  phandleRetry = () => {
    this.fetchProfile()
  }

  jhandleRetry = () => {
    this.fetchJobs()
  }

  onChangeSearch = event => {
    this.setState({search: event.target.value})
  }

  onChangeEmploymentType = event => {
    const {employmentType} = this.state
    const {value} = event.target
    if (employmentType.includes(value)) {
      this.setState(
        prevState => ({
          employmentType: prevState.employmentType.filter(
            type => type !== value,
          ),
        }),
        this.fetchJobs,
      )
    } else {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, value],
        }),
        this.fetchJobs,
      )
    }
  }

  onChangeSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.fetchJobs)
  }

  logout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
    </div>
  )

  renderProfileErrorView = () => (
    <div className="error-view">
      <button type="button" onClick={this.phandleRetry}>
        Retry
      </button>
    </div>
  )

  renderErrorView = () => (
    <div className="error-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.jhandleRetry}>
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => (
    <div className="no-jobs-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderJobsList = () => {
    const {jobs} = this.state
    return (
      <div className="jobs-list">
        {jobs.map(job => (
          <JobItem key={job.id} job={job} />
        ))}
      </div>
    )
  }

  renderContent = () => {
    const {loading, error, jobs} = this.state

    switch (true) {
      case loading:
        return this.renderLoaderView()
      case error === 'Failed to fetch jobs':
        return this.renderErrorView()
      case jobs.length === 0:
        return this.renderNoJobsView()
      default:
        return this.renderJobsList()
    }
  }

  renderProfileContent = () => {
    const {profileLoading, profileError, profileDetails} = this.state

    switch (true) {
      case profileLoading:
        return this.renderLoaderView()
      case profileError === 'Failed to fetch profile':
        return this.renderProfileErrorView()
      default:
        return <Profile profileDetails={profileDetails} />
    }
  }

  render() {
    const {search} = this.state

    return (
      <div className="jobs-container">
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
              <button type="button" onClick={this.logout} aria-label="Logout">
                Logout
              </button>
            </li>
          </ul>
        </header>
        <div className="profile-container">{this.renderProfileContent()}</div>
        <div className="jobs-content">
          <div className="search-container">
            <input
              type="search"
              value={search}
              onChange={this.onChangeSearch}
              placeholder="Search"
              aria-label="Search"
            />
            <button
              type="button"
              data-testid="searchButton"
              onClick={this.handleSearch}
              aria-label="Search Button"
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="filters-container">
            <h1>Type of Employment</h1>
            <ul>
              {employmentTypesList.map(type => (
                <li key={type.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={type.employmentTypeId}
                    value={type.employmentTypeId}
                    onChange={this.onChangeEmploymentType}
                  />
                  <label htmlFor={type.employmentTypeId}>{type.label}</label>
                </li>
              ))}
            </ul>
            <h1>Salary Range</h1>
            <ul>
              {salaryRangesList.map(range => (
                <li key={range.salaryRangeId}>
                  <input
                    type="radio"
                    id={range.salaryRangeId}
                    value={range.salaryRangeId}
                    name="salary"
                    onChange={this.onChangeSalaryRange}
                  />
                  <label htmlFor={range.salaryRangeId}>{range.label}</label>
                </li>
              ))}
            </ul>
          </div>
          <div className="jobs-list-container">{this.renderContent()}</div>
        </div>
      </div>
    )
  }
}

export default Jobs
