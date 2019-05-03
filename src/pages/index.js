import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/layoutShopping'
import FeedProduct from '../components/feedProduct';

class RootIndex extends React.Component {
  
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')

    return (
      <Layout location={this.props.location} >
        <Helmet title={siteTitle} />
        <div className="productFrame">
          <FeedProduct />
        </div>
      </Layout>
    )    

    // return (
    //   <Layout location={this.props.location} >
    //     <Helmet title={siteTitle} />
    //     <div className="wrapper">
    //       <FeedProduct />
    //     </div>
    //   </Layout>
    // )
  }
}

export default RootIndex

export const pageQuery = graphql`
  query TempHomeQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
