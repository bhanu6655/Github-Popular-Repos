import {useState, useEffect, useCallback} from 'react'
import Loader from 'react-loader-spinner'
import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'
import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  pending: 'PENDING',
  failure: 'FAILURE',
}

const GithubPopularRepos = () => {
  const [activeFilterId, setActiveFilterId] = useState(
    languageFiltersData[0].id,
  )
  const [repoList, setRepoList] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  const getRepos = useCallback(async () => {
    setApiStatus(apiStatusConstants.pending)

    try {
      const url = `https://apis.ccbp.in/popular-repos?language=${activeFilterId}`
      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()
        const formattedData = data.popular_repos.map(each => ({
          name: each.name,
          id: each.id,
          issuesCount: each.issues_count,
          forksCount: each.forks_count,
          starsCount: each.stars_count,
          avatarUrl: each.avatar_url,
        }))
        setRepoList(formattedData)
        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure)
    }
  }, [activeFilterId])

  useEffect(() => {
    getRepos()
  }, [getRepos])

  const renderRepos = () => (
    <ul className="repos-details">
      {repoList.map(eachRepo => (
        <RepositoryItem key={eachRepo.id} eachRepository={eachRepo} />
      ))}
    </ul>
  )

  const renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failed to fetch repositories"
        className="failure-view"
      />
      <h2>Something Went Wrong</h2>
    </div>
  )

  const renderLoadingView = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const renderFinalView = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderRepos()
      case apiStatusConstants.pending:
        return renderLoadingView()
      case apiStatusConstants.failure:
        return renderFailure()
      default:
        return null
    }
  }

  const onClickFilter = id => {
    setActiveFilterId(id)
  }

  return (
    <div className="github-repo-container">
      <h1 className="popular-heading">Popular</h1>
      <ul className="list-items">
        {languageFiltersData.map(filter => (
          <LanguageFilterItem
            key={filter.id}
            filterDetails={filter}
            isActive={activeFilterId === filter.id}
            onClickFilter={onClickFilter}
          />
        ))}
      </ul>
      {renderFinalView()}
    </div>
  )
}

export default GithubPopularRepos
