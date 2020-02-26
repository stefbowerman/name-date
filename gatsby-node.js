const Promise = require('bluebird')
const path = require('path')

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions

  const typeDefs = `
    type ShopifyProductPriceRangeMinVariantPrice {
      amount: String
      currencyCode: String
    }
    type ShopifyProductPriceRangeMaxVariantPrice {
      amount: String
      currencyCode: String
    }
    type ShopifyProductPriceRange {
      minVariantPrice: ShopifyProductPriceRangeMinVariantPrice
      maxVariantPrice: ShopifyProductPriceRangeMaxVariantPrice
    }
    type ShopifyProductImage {
      id: String
      originalSrc: String
    }
    type ShopifyProductOption implements Node {
      name: String
      values: [String]
    }
    type ShopifyProductVariantSelectedOptions {
      name: String
      value: String
    }
    type ShopifyProductVariant implements Node {
      shopifyId: String
      title: String
      availableForSale: Boolean
      price: String
      selectedOptions: [ShopifyProductVariantSelectedOptions]
    }
    type ShopifyProduct implements Node {
      id: ID!
      shopifyId: String
      title: String
      handle: String
      descriptionHtml: String
      availableForSale: Boolean
      images: [ShopifyProductImage]
      priceRange: ShopifyProductPriceRange
      options: [ShopifyProductOption]
      variants: [ShopifyProductVariant]
      createdAt: Date
    }
    type ShopifyCollection implements Node {
      products: [ShopifyProduct]
    }
  `
  
  createTypes(typeDefs)
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const projectTemplate = path.resolve('./src/templates/project.js')
    resolve(
      graphql(
        `
          {
            allContentfulProject {
              edges {
                node {
                  title
                  slug
                }
              }
            }
          }
          `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const projects = result.data.allContentfulProject.edges
        projects.forEach((project, index) => {
          createPage({
            path: `/project/${project.node.slug}/`,
            component: projectTemplate,
            context: {
              slug: project.node.slug
            },
          })
        })
      })
    )
  })  

  // return new Promise((resolve, reject) => {
  //   const blogPost = path.resolve('./src/templates/blog-post.js')
  //   resolve(
  //     graphql(
  //       `
  //         {
  //           allContentfulBlogPost {
  //             edges {
  //               node {
  //                 title
  //                 slug
  //               }
  //             }
  //           }
  //         }
  //         `
  //     ).then(result => {
  //       if (result.errors) {
  //         console.log(result.errors)
  //         reject(result.errors)
  //       }

  //       const posts = result.data.allContentfulBlogPost.edges
  //       posts.forEach((post, index) => {
  //         createPage({
  //           path: `/blog/${post.node.slug}/`,
  //           component: blogPost,
  //           context: {
  //             slug: post.node.slug
  //           },
  //         })
  //       })
  //     })
  //   )
  // })
}
