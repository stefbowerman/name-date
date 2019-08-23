import React from 'react'
import { Link } from 'gatsby'

export default () => (
  <nav role="navigation">
    <ul className="navigation">
      <li className="navigationItem">
        <Link to="/">Work</Link>
      </li>
      <li className="navigationItem">
        <Link to="/about">About</Link>
      </li>
      <li className="navigationItem">
        <Link to="/shop">Shop</Link>
      </li>
    </ul>
  </nav>
)
