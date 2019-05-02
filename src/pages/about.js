import React from 'react'
import { graphql } from 'gatsby'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from "../components/layout"

class AboutIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')

    return (
      <Layout location={this.props.location} >
        <Helmet title={siteTitle} />
        <h1 className="section-headline">About</h1>
        <div className="wrapper">
          About content here
        </div>
      </Layout>
    )
  }
}

export default AboutIndex

export const pageQuery = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`