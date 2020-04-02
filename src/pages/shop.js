import React from 'react'
import { graphql } from 'gatsby'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import ShopProduct from '../components/shopProduct'

class ShopPage extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const products = get(this, 'props.data.shopifyCollection.products', [])

    return (
      <Layout location={this.props.location} >
        <Helmet title={ `Shop | ${siteTitle}` } />
        <div className="shopWrapper">
          {products && products.length && products.map((product, i) => {
            return (
              <ShopProduct product={product} key={i} />
            )
          })}
        </div>
      </Layout>
    )
  }
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