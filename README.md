# gatsby-pagination

[![NPM version](http://img.shields.io/npm/v/gatsby-pagination.svg?style=flat-square)](https://www.npmjs.org/package/gatsby-pagination)
[![Travis build status](http://img.shields.io/travis/infinitedescent/gatsby-pagination/master.svg?style=flat-square)](https://travis-ci.org/infinitedescent/gatsby-pagination)
[![Coverage Status](https://coveralls.io/repos/github/infinitedescent/gatsby-pagination/badge.svg)](https://coveralls.io/github/infinitedescent/gatsby-pagination)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

This simple utility is intended to help authors add pagination to their [GatsbyJS](https://www.gatsbyjs.org/) projects. The library works by dividing the provided data set into smaller subsets, then calling Gatsby's [createPage](https://www.gatsbyjs.org/docs/bound-action-creators/#createPage) method for each subset. In addition to the subset data itself, each page also receives helpful pagination variables, modeled after [Ghost's](https://ghost.org/) [pagination](https://themes.ghost.org/docs/pagination) data.

## Installation

```sh
npm install --save gatsby-pagination
```

## Usage

### Overview

To create pages with pagination, _gatsby-pagination_ should be required in
`gatsby-node.js`. Instead of calling Gatsby's _createPage_ directly, call
_createPaginationPages_. The method requires a reference to _createPage_, your
data set, as well as a _component_.

> The _name_ of the component is critical to the location of the intended page, see Gatsby's [createPage](https://www.gatsbyjs.org/docs/node-apis/#createPages) documentation to learn more about _components_.

Starting from the root page, each additional page included it's page number in the route. e.g. `/blog` for page 1, `/blog/2` for page 2, etc.

Recommended reference: [Creating pages in gatsby-node.js](https://www.gatsbyjs.org/docs/creating-and-modifying-pages/)

### Require the package

In `gatsby-node.js` require or import the _createPaginationPages_ factory method from _gatsby-paginate_.

```js
const { createPaginationPages } = require("gatsby-paginate");
```

### Call createPaginatePages

In _export.createPages_ get a reference to Gatsby's _createPage_ method from access to _boundActionCreators_.
Provide _createPaginatePages_ with _createPage_, the data set of nodes, and the _component_ to generate the pages with pagination.
Additionally, _createPaginationPages_ takes optional _limit_ parameters for setting the maximum number of node per subset and _pathFormatter_ which can be use to creating custom
paths.

See the [createPaginatePages](https://infinitedescent.github.io/gatsby-pagination/#createpaginationpages) documentation for more details.

```js
exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const indexPage = path.resolve("src/components/index.jsx");
    const postPage = path.resolve("src/components/post.jsx");
    resolve(
      graphql(
        `add GraphQL query`
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

Create an `index.js` templates and make sure to remove any other pages
which could collide with the '/index' path. Gatsby-pagination adds extra
pagination properties to the page's _pathContext_, such as _prev_ and _next_.

See the [pathContext](https://infinitedescent.github.io/gatsby-pagination/#pathcontext) documentation for more details.

```js
import React from "react";
import Link from "gatsby-link";

const IndexPage = ({ data, pathContext }) => {
  const { nodes, page, prev, next, pages, total, limit } = pathContext;
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

export const query = graphql`add GraphQL query`;
```

## License

MIT
