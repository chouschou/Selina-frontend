import React from 'react'
import './TabBar.scss'

const TabBar = ({ activeTab, onTabChange }) => {
  return (
    <div className="tab-bar">
      <button
        className={`tab-button ${activeTab === 'frames' ? 'active' : ''}`}
        onClick={() => onTabChange('frames')}
      >
        Gọng kính
      </button>
      <button
        className={`tab-button ${activeTab === 'lenses' ? 'active' : ''}`}
        onClick={() => onTabChange('lenses')}
      >
        Kính mắt
      </button>
    </div>
  )
}

export default TabBar