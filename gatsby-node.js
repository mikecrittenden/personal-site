const Promise = require('bluebird');
const path = require('path');

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js');
    resolve(
      graphql(
        `
          {
            allAirtablePosts {
              edges {
                node {
                  Slug
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors)
        }

        // Create blog posts pages.
        const posts = result.data.allAirtablePosts.edges;

        posts.forEach((post, index) => {
          createPage({
            path: 'ramblings/' + post.node.Slug,
            component: blogPost,
            context: {
              slug: post.node.Slug,
            },
          })
        })
      })
    )
  })
};
