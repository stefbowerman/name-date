import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'

import ShopProduct from '../components/shopProduct'

const ShopPage = ({ data }) => {
  const products = get(data, 'shopifyCollection.products', [])

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Shop | ${data.site.siteMetadata.title}`}</title>
        <meta property="og:title" content={`Shop | ${data.site.siteMetadata.title}`}></meta>
      </Helmet>
      
      <div className="shopWrapper">
        {products && products.length && products.map((product, i) => {
          return (
            <ShopProduct
              product={product}
              key={i}
            />
          )
        })}
      </div>
    </React.Fragment>
  )
}

export default ShopPage

export const pageQuery = graphql`
  query ShopQuery {
    site {
      siteMetadata {
        title
      }
    }
    shopifyCollection(handle: {eq: "webstore"}) {
      products {
        id
        shopifyId
        title
        handle
        descriptionHtml
        availableForSale
        images {
          originalSrc
        }
        priceRange {
          minVariantPrice {
            amount
          }
          maxVariantPrice {
            amount
          }
        }
        options {
          name
          values
        }
        variants {
          shopifyId
          title
          availableForSale
          price
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`