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


    return (
      <Layout location={this.props.location} >
        <Helmet title={ `Shop | ${siteTitle}` } />
        <BackButton />
        <div className="shopWrapper">
          <ShopProduct />
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
  }
`