"use strict";

import PaginationPageBuilder from "./pagination-page-builder";
import { DEFAULT_PATH_FORMATTER } from "./constants";

/**
 * Creates Gatsby pages with pagination by calling Gatsby's {@link https://www.gatsbyjs.org/docs/bound-action-creators/#createPage|createPage} API. Each page is provided additional pagination properties in the {@link pathContext} parameter.
 *
 * @requires module:gatsby
 * @param {Object} props - properties
 * @param {function} props.createPage - reference to Gatsby's createPage method, library will pass pagination properties to {@link context} object.
 * @param {Array.<Object>} props.edges - collection of data nodes
 * @param {string} props.component - the resolved path of the component for each page
 * @param {number} [props.limit=10] - the posts per page limit
 * @param {function} [props.pathFormatter=DEFAULT_PATH_FORMATTER] - the pathFormatter to be used to construct page paths
 *
 * @throws {Error} Argument `createPage` must be provided.
 * @throws {Error} Argument `edges` must be provided.
 * @throws {Error} Argument `component` must be provided.
 *
 * @see pathContext
 * @see [Gatsby's createPage documentation]{@link https://www.gatsbyjs.org/docs/bound-action-creators/#createPage}
 *
 * @example
 * createPaginationPages({
 *   createPage: createPage,
 *   edges: result.data.allMarkdownRemark.edges,
 *   component: path.resolve(`./src/templates/my-sweet-new-page.js`),
 *   // define number of posts per page with limit, which defaults to 10.
 *   limit: 5
 *  });
 */
export function createPaginationPages(props) {
  /**
   * Sample pathContext received in component.
   * @typedef {Object} pathContext
   * @property {Array<Object>} nodes - the subset of Edge nodes
   * @property {number} limit - the maximum number of nodes per page
   * @property {number} page - the current page number, base-1
   * @property {number} pages - the total number of pages
   * @property {number} total - the total number of nodes
   * @property {string|undefined} prev - the path of previous page if it exists
   * @property {string|undefined} next - the path of next page if it exists
   *
   * @example
   * import React from "react";
   *
   * const IndexPage = ({ data, pathContext }) => {
   *   const { nodes, page, prev, next, pages, total, limit } = pathContext;
   *   //...
   * });
   */
  const { createPage, edges, component, limit, pathFormatter } = props;
  const paginationPageBuilder = new PaginationPageBuilder(
    createPage,
    edges,
    component
  );
  if (limit) paginationPageBuilder.setLimit(limit);
  if (pathFormatter) paginationPageBuilder.setPathFormatter(pathFormatter);
  paginationPageBuilder.build();
}

/**
 * Optional path formatter generates a relative path prepended by a prefix.
 *
 * @type {function}
 * @constant
 * @param {string} prefix - prefix to prepend path
 * @returns {function(pageNumber): string} - path formatter intended for createPaginationPages
 *
 * @see createPaginationPages
 *
 * @example
 * createPaginationPages({
 *   createPage: createPage,
 *   edges: result.data.allMarkdownRemark.edges,
 *   component: path.resolve(`./src/templates/my-sweet-new-page.js`),
 *   // path results: /blog, /blog/2, /blog/3, ...etc
 *   pathFormatter: prefixPathFormatter("/blog")
 * });
 */
export const prefixPathFormatter = prefix => pageNumber =>
  `${prefix}${DEFAULT_PATH_FORMATTER(pageNumber)}`;
