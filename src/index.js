import PaginationPageBuilder from "./pagination-page-builder";
import LinkedPageBuilder from "./linked-page-builder";
import { DEFAULT_PATH_FORMATTER } from "./constants";

/**
 * A collection of pagination tools for {@link https://www.gatsbyjs.org|Gatsby}.
 * @module gatsby-pagination
 */

/**
 * Factory method used to create Gatsby's pages, each provided with a subset of nodes and pagination properties, including the paths of the previous (`prev`) and `next` posts if they exist.  The API divides the provided data nodes into groups which it provides to the Gatsby's {@link https://www.gatsbyjs.org/docs/bound-action-creators/#createPage|createPage} API, along with additional pagination properties. This pagination data is accessible within each 'components' via the {@link PaginationPage~pathContext|pathContext} parameter.
 *
 * @requires module:gatsby
 * @param {Object} props - properties
 * @param {function} props.createPage - reference to Gatsby's {@link https://www.gatsbyjs.org/docs/bound-action-creators/#createPage|createPage} method
 * @param {Array.<Object>} props.edges - collection of data nodes
 * @param {string} props.component - The absolute path to the component used for each page
 * @param {number} [props.limit=10] - the posts per page limit
 * @param {pathFormatter} [props.pathFormatter=DEFAULT_PATH_FORMATTER] - the formatter to use when generating page paths
 *
 * @throws {Error} Argument `createPage` must be provided.
 * @throws {Error} Argument `edges` must be provided.
 * @throws {Error} Argument `component` must be provided.
 *
 * @see [Gatsby's createPage documentation]{@link https://www.gatsbyjs.org/docs/bound-action-creators/#createPage}
 *
 * @example
 *
 * <caption>each page created will have pagination properties, see {@link PaginationPage~pathContext|pathContext}</caption>
 *
 * // usage inside gatsby-node.js
 * import {createPaginationPages} from "gatsby-pagination";
 *
 * // ...
 * createPaginationPages({
 *   createPage: createPage,
 *   edges: result.data.allMarkdownRemark.edges,
 *   component: path.resolve(`./src/templates/my-sweet-new-page.js`),
 *   // define number of posts per page with limit, which defaults to 10.
 *   limit: 5
 * });
 */
export function createPaginationPages(props) {
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
 * This callback is provided the current edge and must generate the `path` and optionally `context` object for each page.
 * @callback pathFormatter
 * @param {string} path - The original path to format.
 * @return {string} The formatted path.
 *
 * @example
 * // ...
 * createPaginationPages({
 *   createPage: createPage,
 *   edges: result.data.allMarkdownRemark.edges,
 *   component: path.resolve(`./src/templates/my-sweet-new-page.js`),
 *   // example pathFormatter
 *   pathFormatter: path => `/blog/${path}`;
 * });
 */

/**
 * @typedef {Object} PaginationPage~pathContext
 * The additional properties provided by createPaginationPages API to each component page created by Gatsby's createPage API.
 * @property {Array<Object>} nodes - the subset of Edge nodes
 * @property {number} limit - the maximum number of nodes per page
 * @property {number} page - the current page number, base-1
 * @property {number} pages - the total number of pages
 * @property {number} total - the total number of nodes
 * @property {string|undefined} prev - the path of previous page if it exists
 * @property {string|undefined} next - the path of next page if it exists
 *
 * @example
 * // usage of properties provided by createPaginationPages inside the component.
 * import React from "react";
 *
 * const IndexPage = ({ data, pathContext }) => {
 *   const { nodes, page, prev, next, pages, total, limit } = pathContext;
 *
 *   //...
 * });
 */

/**
 * An optional path formatter to utilize with createPaginationPages, enabling users to generate page paths prepend by a prefix.
 *
 * @param {string} prefix - prefix to prepend path
 * @return {function(pageNumber): string} - path formatter intended for createPaginationPages
 *
 * @see createPaginationPages
 *
 * @example
 * // usage inside gatsby-node.js
 * import {createPaginationPages, prefixPathFormatter} from "gatsby-pagination";
 *
 * //...
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

/**
 * Factory method used to create Gatsby's pages, each provided with a single of data nodes and pagination properties, including the paths to the previous (`prev`) and `next` post if they exist.  The API provides each node to Gatsby's {@link https://www.gatsbyjs.org/docs/bound-action-creators/#createPage|createPage} API, along with additional pagination properties, perfect for posts that would like to link to the previous or next post. This pagination data is accessible within each 'components' via it's {@link LinkedPage~pathContext|pathContext} parameter.
 *
 * @param {Object} props - properties
 * @param {function} props.createPage - reference to Gatsby's {@link https://www.gatsbyjs.org/docs/bound-action-creators/#createPage|createPage} method
 * @param {Array.<Object>} props.edges - collection of data nodes
 * @param {string} props.component - The absolute path to the component used for each page
 * @param {edgeParser} [props.edgeParser] - the edgeParser that handles providing properties handed to createPage per Edge
 * @param {boolean} props.circular - if the pagination should link the first and last post, looping the content.
 *
 * @throws {Error} Argument `createPage` must be provided.
 * @throws {Error} Argument `edges` must be provided.
 * @throws {Error} Argument `component` must be provided.
 * @throws {Error} Argument `edgeParser` must be provided.
 *
 * @see [Gatsby's createPage documentation]{@link https://www.gatsbyjs.org/docs/bound-action-creators/#createPage}
 *
 * @example
 * <caption>each page created will have pagination properties, see {@link LinkedPage~pathContext|pathContext}</caption>
 *
 * // usage inside gatsby-node.js
 * import {createLinkedPages} from "gatsby-pagination";
 *
 * //...
 * createLinkedPages({
 *   createPage: createPage,
 *   edges: result.data.allMarkdownRemark.edges,
 *   component: path.resolve(`./src/templates/my-sweet-pages.js`),
 *   edgeParser: edge => ({
 *     path: `/${edge.node.fields.slug}`,
 *     context: {
 *       slug: edge.node.fields.slug
 *     }
 *   });
 * });
 */
export function createLinkedPages(props) {
  const {
    createPage,
    edges,
    component,
    edgeParser: edgeParser,
    circular
  } = props;
  const linkedPageBuilder = new LinkedPageBuilder(
    createPage,
    edges,
    component,
    edgeParser
  );
  if (circular) linkedPageBuilder.setCircular(circular);
  linkedPageBuilder.build();
}
/**
 * Parses a given 'edge' and extracts the `path` and optionally `context` data to be passed to Gatsby's createPage API.
 * @callback edgeParser
 * @param {Object} edge - data node to parse
 * @returns {EdgeParserStruct} - payload intended for createPage API.
 *
 * @example
 * //...
 * createLinkedPages({
 *   createPage: createPage,
 *   edges: result.data.allMarkdownRemark.edges,
 *   component: path.resolve(`./src/templates/my-sweet-pages.js`),
 *   // example edgeParser
 *   edgeParser: edge => ({
 *     path: `/${edge.node.fields.slug}`,
 *     context: {
 *       slug: edge.node.fields.slug
 *     }
 *   });
 * });
 */

/**
 *  @class EdgeParserStruct
 *  @type {Object}
 *  @property {string} path - the path data to pass to pageCreate.
 *  @property {Object} [context] - the context data to pass to pageCreate, See [Gatsby documentation]@link{https://www.gatsbyjs.org/docs/bound-action-creators/#createPage}
 */

/**
 * @typedef {Object} LinkedPage~pathContext
 * @property {number} total - the total number of nodes/pages
 * @property {string|undefined} prev - the path of previous page if it exists
 * @property {string|undefined} next - the path of next page if it exists
 *
 * @example
 * // usage of properties provided by createLinkedPages inside the component.
 * import React from "react";
 *
 * const IndexPage = ({ data, pathContext }) => {
 *   const { prev, next, total } = pathContext;
 *
 *   //...
 * });
 */
