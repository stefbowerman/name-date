import React from 'react'
import { graphql } from 'gatsby'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import BackButton from '../components/backButton'
import ShopProduct from '../components/shopProduct'

class ShopPage extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const products = get(this, 'props.data.allShopifyProduct.edges')

    return (
      <Layout location={this.props.location} >
        <Helmet title={ `Shop | ${siteTitle}` } />
        <BackButton />
        <div className="shopWrapper">
          {products.map(({ node }, i) => {
            return (
              <ShopProduct product={node} key={i} />
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
    allShopifyProduct(
      sort: {
        fields: [createdAt]
        order: DESC
      }
    ) {
      edges {
        node {
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
  }
`