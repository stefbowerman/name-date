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

const Navigation = props => {
  const hasProducts = !!(props.data.collection.products && props.data.collection.products.length)

  return (
    <nav role="navigation">
      <ul className="navigation">
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
