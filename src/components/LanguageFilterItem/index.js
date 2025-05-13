import './index.css'

const LanguageFilterItem = props => {
  const {filterDetails, isActive, onClickFilter} = props
  const {id, language} = filterDetails

  const buttonClass = isActive ? 'filter-button active' : 'filter-button'

  const handleClick = () => {
    onClickFilter(id)
  }

  return (
    <li className="nav-items">
      <button type="button" className={buttonClass} onClick={handleClick}>
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem
