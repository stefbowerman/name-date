import React from 'react'
import {Link, graphql, StaticQuery} from 'gatsby'

const query = graphql`
  query NavigationQuery {
    collection: shopifyCollection(handle: {eq: "webstore"}) {
      products {
        handle
      }
    }
  }
`

const Navigation = ({ data, show }) => {
  const hasProducts = !!(data.collection.products && data.collection.products.length)
  const cn = `navigation ${!show ? 'is-hidden' : ''}`

  return (
    <nav role="navigation">
      <ul className={cn}>
        <li className="navigationItem">
          <Link to="/">Work</Link>
        </li>
        <li className="navigationItem">
          <Link to="/about">About</Link>
        </li>
        {hasProducts && 
          <li className="navigationItem">
            <Link to="/shop">Shop</Link>
          </li>
        }
        <li className="navigationItem">
          <Link to="/date">Date</Link>
        </li>        
      </ul>
    </nav>
  )
}

export default props => (
  <StaticQuery
    query={query}
    render={data => <Navigation data={data} {...props} />}
  />
)
