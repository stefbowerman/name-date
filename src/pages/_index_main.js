import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import FeedItem from '../components/feedItem';

class RootIndex extends React.Component {
  constructor(props) {
    super(props)

    this.w = window;
    this.d = document;
    this.documentElement = this.d.documentElement;
    this.body = this.d.getElementsByTagName('body')[0];

    this.updateDimensions = this.updateDimensions.bind(this)

    const width = this.w.innerWidth || this.documentElement.clientWidth || this.body.clientWidth;
    const height = this.w.innerHeight|| this.documentElement.clientHeight|| this.body.clientHeight;

   
    this.state = { width, height }
    // console.log(this) 
  }  
  componentDidMount() {
    console.log('mounted!')
    // console.log(this)
  }
  updateDimensions() {
    const width = this.w.innerWidth || this.documentElement.clientWidth || this.body.clientWidth;
    const height = this.w.innerHeight|| this.documentElement.clientHeight|| this.body.clientHeight;

    this.setState({width, height});
  }
  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }  
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const feedItems = get(this, 'props.data.allContentfulFeed.edges')

    return (
      <Layout location={this.props.location} >
        <Helmet title={siteTitle} />
        <div className="wrapper">
          <div>{this.state.height} x {this.state.width}</div>
          {feedItems.map((data) => {
            return (
              <FeedItem key={data.node.id} image={data.node.image} project={data.node.project} />
            )
          })}
        </div>
      </Layout>
    )
  }
}

export default RootIndex

export const pageQuery = graphql`
  query HomeQuery {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulFeed {
      edges {
        node {
          id
          image {
            resize(width: 1180) {
              src
              width
              height
            }
          }
          project {
            id
            title
            slug
            featuredImage {
              resize(width: 1180) {
                src
                width
                height
              }
            }
            caption {
              childMarkdownRemark {
                html
              }
            }
            description {
              childMarkdownRemark {
                html
              }
            }
            images {
              resize(width: 1180) {
                src
                width
                height
              }
            }
          }
        }
      }
    }       
  }
`
