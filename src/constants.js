/**
 * Constants for Gatsby-Pagination
 * @private
 * @module constants
 * @type {Object}
 */

/**
 * The limit which gatsby-paginate will default to in createPaginatedPages.
 *
 * @private
 * @constant
 * @type {number}
 * @default 10
 *
 * @see createPaginationPages
 */
export const DEFAULT_LIMIT = 10;

/**
 * The default path formatter generates a relative path starting with "/", use by createPaginatedPages.
 *
 * @private
 * @constant
 * @type {function}
 * @default
 *
 * @see createPaginationPages
 */
export const DEFAULT_PATH_FORMATTER = pageNumber =>
  pageNumber === 1 ? "/" : `/${pageNumber}`;

export default {
  DEFAULT_LIMIT,
  DEFAULT_PATH_FORMATTER
};
