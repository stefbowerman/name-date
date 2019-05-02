import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import ProjectPreview from '../components/projectPreview'

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
    console.log(this) 
  }  
  componentDidMount() {
    console.log('mounted!')
    console.log(this)
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
    const projects = get(this, 'props.data.allContentfulProject.edges')
    let imageMap = [];

    projects.map(({ node }) => {
      if(node.images && node.images.length) {
        node.images.map((image, i) => {
          const key = `${node.slug}-${i}`
          imageMap.push({image, node, key});
        })
      }
    })

    // imageMap = shuffle(imageMap)

    return (
      <Layout location={this.props.location} >
        <Helmet title={siteTitle} />
        <div className="wrapper">
          <div>{this.state.height} x {this.state.width}</div>
          {imageMap.map((data) => {
            return (
              <ProjectPreview project={data.node} image={data.image} key={data.key} />
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
    allContentfulProject {
      edges {
        node {
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
`
