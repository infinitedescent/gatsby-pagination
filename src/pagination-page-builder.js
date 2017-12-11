import constants from "./constants";

/**
 * Creates the subsets of node based on limit
 * @param {Array.<Object>} edges - the list of edges/nodes
 * @param {number} limit - the limit of nodes per subset
 * @return {{Array.<Array.<Object>>}} - subsets of edges
 * @private
 */
const createEdgeSubsets = (edges, limit) => {
  return edges
    .map((edge, index) => {
      return index % limit === 0 ? edges.slice(index, index + limit) : null;
    })
    .filter(item => item);
};

/**
 * @param index {number} page index
 * @return {boolean} - if page have a previous page.
 * @private
 */
const hasPrevPage = index => index - 1 >= 0;

/**
 * @param index {number} page index
 * @param pages {number} number of pages
 * @return {boolean} - if page have a next page.
 * @private
 */
const hasNextPage = (index, pages) => index + 1 < pages.length;

/**
 * Chainable builder that generates Gatsby pages with pagination, utilizing Gatsby's createPage.
 *
 * @private
 * @param {function} createPage - reference to Gatsby's createPage method
 * @param {Array.<Object>} edges - collection of data nodes
 * @param {string} component - the resolved path of the component for each page
 *
 * @throws {Error} Argument `createPage` must be provided.
 * @throws {Error} Argument `edges` must be provided.
 * @throws {Error} Argument `component` must be provided.
 *
 * @see gatsby-pagination.createPaginationPages
 * [Gatsby's createPage documentation]{@link https://www.gatsbyjs.org/docs/bound-action-creators/#createPage}
 */
class PaginationPageBuilder {
  constructor(createPage, edges, component) {
    if (!createPage) throw Error("Argument `createPage` must be provided.");
    if (!edges) throw Error("Argument `edges` must be provided.");
    if (!component) throw Error("Argument `component` must be provided.");

    this.createPage = createPage;
    this.edges = edges;
    this.component = component;
    this.limit = constants.DEFAULT_LIMIT;
    this.pathFormatter = constants.DEFAULT_PATH_FORMATTER;

    this.setLimit = this.setLimit.bind(this);
    this.setPathFormatter = this.setPathFormatter.bind(this);
    this.build = this.build.bind(this);
  }

  /**
   * Set a custom limit.
   * @param {number} value - the limit of nodes per page
   * @returns {Object} - object instance to be chainable
   */
  setLimit(value) {
    this.limit = value;
    return this;
  }

  /**
   * Set a custom path formatter, path formatters are function which take a
   * pageNumber and return the path which Gatsby should use for given page.
   *
   * @param {function(pageNumber): path} formatter - the method used to format path for pages
   * @returns {Object} - object instance to be chainable
   */
  setPathFormatter(formatter) {
    this.pathFormatter = formatter;
    return this;
  }

  /**
   * start build process to create pages with pagination.
   */
  build() {
    createEdgeSubsets(this.edges, this.limit).forEach(
      (subset, index, subsets) => {
        let pageNumber = index + 1;
        let context = {
          nodes: subset,
          page: pageNumber,
          pages: subsets.length,
          total: this.edges.length,
          limit: this.limit
        };

        if (hasPrevPage(index)) {
          context.prev = this.pathFormatter(pageNumber - 1);
        }

        if (hasNextPage(index, subsets)) {
          context.next = this.pathFormatter(pageNumber + 1);
        }

        return this.createPage({
          path: this.pathFormatter(pageNumber),
          component: this.component,
          context: context
        });
      }
    );
  }
}

export default PaginationPageBuilder;
