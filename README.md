# gatsby-pagination

[![NPM version](http://img.shields.io/npm/v/gatsby-pagination.svg?style=flat-square)](https://www.npmjs.org/package/gatsby-pagination)
[![Travis build status](http://img.shields.io/travis/infinitedescent/gatsby-pagination/master.svg?style=flat-square)](https://travis-ci.org/infinitedescent/gatsby-pagination)
[![Coverage Status](https://coveralls.io/repos/github/infinitedescent/gatsby-pagination/badge.svg)](https://coveralls.io/github/infinitedescent/gatsby-pagination)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

This simple utility is intended to help authors add any form of pagination to there [GatsbyJS](https://www.gatsbyjs.org/) projects. The library, especially the variables passed to each page, was inspired but the [pagination](https://themes.ghost.org/docs/pagination) of Ghost.
The library works by wrapping Gatsby's [createPage](https://www.gatsbyjs.org/docs/bound-action-creators/#createPage) method and creating creating pages with the desired number of nodes, typically posts, per page. Each page receives the nodes for that page, along with commonly used pagination parameters.

## Installation

```sh
npm install --save gatsby-pagination
```

## Usage

### Overview

To create pages with pagination, _gatsby-pagination_ should be required in
`gatsby-node.js` and instead of calling Gatsby's _createPage_ directly call
_createPaginationPages_. The method will requires a reference to _createPage_
as well as a _component_. The name of the component is critical to the location
of the intended page, for most users the component should be named `index.js`.
See the additional documentation for more information as well as the example
projects.

### Require the package

In `gatsby-node.js` require the _gatsby-paginate_ library.

```js
const { createPaginationPages } = require("gatsby-paginate");
```

### Call createPaginatePages

Gatsby calls the exported [_createPages_](https://www.gatsbyjs.org/docs/node-apis/#createPages) method in `gatsby-node.js`
when its time to start generating static pages. The framework expects the use of _bound-action-creators_
such as [_createPage_](https://www.gatsbyjs.org/docs/bound-action-creators/#createPage) to generate the pages
that make up your site. Typically, one would call _createPage_
directly; however, we want to use _gatsby-paginate_ instead, which will divide the data set
into subsets, each containing 10 nodes (customizable via _limit_ parameter). For each of these subsets the library
calls _createPage_, forwarding the subset of notes along with other pagination parameters such
as _prev_ and _next_. Additionally, _createPaginationPages_ takes optional parameters _limit_
to control the maximum number of node per subset and _pathFormatter_; which is callback for creating custom
paths.

```js
exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const indexPage = path.resolve("src/components/index.jsx");
    const postPage = path.resolve("src/components/post.jsx");
    resolve(
      graphql(
        `` // GraphQL Query
      ).then(result => {
        if (result.errors) {
          reject(result.errors);
        }

        createPaginationPages({
          createPage: createPage,
          edges: result.data.allMarkdownRemark.edges,
          component: indexPage,
          limit: 5
        });

          createPage({
            path: edge.node.id,
            component: postPage,
            context: {
              slug: edge.node.fields.slug
            }
          });
        });
      })
    );
  });
};
```

### Create the index.js component

Create an `index.js` file in components and make sure to remove any other pages
which could collide with the '/index' path.

```js
import React from "react";
import Link from "gatsby-link";

const IndexPage = ({ data, pathContext }) => {
  // Note, data is the result of the GraphQL query; however, the path context
  // will have the subset of nodes provided to gatsby-pagination in 'gatsby-node.js'.

  const { nodes, page, prev, next, pages, total, limit } = pathContext;
  // See docs about properties provided by gatsby-pagination'

  const PaginationLink = props => {
    if (props.to && props.text) {
      return <Link to={props.to} text={props.text} />;
    }
    return null;
  };

  return (
    <div>
      {nodes.map(({ node }) => (
        <div className="postList" key={node.id}>
          <div className="postDate">{node.frontmatter.date}</div>
          <Link className="postUrl" to={node.fields.slug}>
            {node.frontmatter.title}
          </Link>
          <div> className="postExcerpt" {node.excerpt}</div>
        </div>
      ))}
      <div className="previousPost">
        <PaginationLink to={prev} text="Go to Previous Page" />
      </div>
      <div className="nextPost">
        <PaginationLink to={next} text="Go to Next Page" />
      </div>
    </div>
  );
};

import Index from "../components/index";

export default IndexPage;

// example par page query
export const query = graphql``;
```

## License

MIT
