import React from 'react'
import ToggleTheme from '../togglebutton/ToggleTheme'
import './Navbar.css'

function Navbar() {
  return (
    <nav>
        <h1 style={{color: 'var(--nav-text-clr)'}}>TaskManager</h1>
        <ToggleTheme />
    </nav>
  )
}

export default Navbar