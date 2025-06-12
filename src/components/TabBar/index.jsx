import React from 'react'
import './TabBar.scss'

const TabBar = ({ activeTab, onTabChange }) => {
  return (
    <div className="tab-bar">
      <button
        className={`tab-button ${activeTab === 'Gọng kính' ? 'active' : ''}`}
        onClick={() => onTabChange('Gọng kính')}
      >
        Gọng kính
      </button>
      <button
        className={`tab-button ${activeTab === 'Kính mát' ? 'active' : ''}`}
        onClick={() => onTabChange('Kính mát')}
      >
        Kính mát
      </button>
    </div>
  )
}

export default TabBar