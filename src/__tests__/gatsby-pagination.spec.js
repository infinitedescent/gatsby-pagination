import { createPaginationPages } from "../index";
import { prefixPathFormatter } from "../index";

const buildMock = () => jest.fn().mockImplementation(value => value);
const buildEdgeSet = (size, obj = {}) =>
  Array.from(Array(size), (_, x) => Object.assign({}, obj));
const runEdgeTest = () => {
  const edges = buildEdgeSet(7);
  const createPage = buildMock();

  createPaginationPages({
    edges: edges,
    createPage: createPage,
    component: "component",
    limit: 2
  });

  return createPage;
};

describe(`gatsby-pagination`, () => {
  test("should generate Gatsby pages, defaulting to 10 items per page", () => {
    const edges = buildEdgeSet(30);
    const createPage = buildMock();
    const expected = 3;

    createPaginationPages({
      edges: edges,
      createPage: createPage,
      component: "component"
    });

    expect(createPage.mock.calls.length).toBe(expected); // inferred by calls to createPage
  });

  test("should allow a custom number of posts per page.", () => {
    const edges = buildEdgeSet(30);
    const createPage = buildMock();
    const expected = 15;

    createPaginationPages({
      edges: edges,
      createPage: createPage,
      component: "component",
      limit: 2
    });

    expect(createPage.mock.calls.length).toBe(expected); // inferred by calls to createPage
  });

  test("should format first pages as blank index page, not with a number", () => {
    const expected = "/";
    const notExpected = "/1";

    const createPage = runEdgeTest();

    expect(createPage.mock.calls[0][0].path).toBe(expected);
    expect(createPage.mock.calls[0][0].path).not.toBe(notExpected);
  });

  test("should start counting pages with second page, e.g. page 2", () => {
    const expected = "/2";

    const createPage = runEdgeTest();

    expect(createPage.mock.calls[1][0].path).toBe(expected);
  });

  test("should providing next property when there are multiple pages", () => {
    const createPage = runEdgeTest();

    expect(createPage.mock.calls[0][0].context.next).toBeDefined();
    expect(createPage.mock.calls[0][0].context.next).toBe("/2");
    expect(createPage.mock.calls[1][0].context.next).toBeDefined();
    expect(createPage.mock.calls[1][0].context.next).toBe("/3");
    expect(createPage.mock.calls[2][0].context.next).toBeDefined();
    expect(createPage.mock.calls[2][0].context.next).toBe("/4");
    expect(createPage.mock.calls[3][0].context.next).not.toBeDefined();
  });

  test("should providing prev property when there are multiple pages", () => {
    const createPage = runEdgeTest();

    expect(createPage.mock.calls[0][0].context.prev).not.toBeDefined();
    expect(createPage.mock.calls[1][0].context.prev).toBeDefined();
    expect(createPage.mock.calls[1][0].context.prev).toBe("/");
    expect(createPage.mock.calls[2][0].context.prev).toBeDefined();
    expect(createPage.mock.calls[2][0].context.prev).toBe("/2");
    expect(createPage.mock.calls[3][0].context.prev).toBeDefined();
    expect(createPage.mock.calls[3][0].context.prev).toBe("/3");
  });

  test("should allow option to create custom paths based on page number", () => {
    const edges = buildEdgeSet(30);
    const createPage = buildMock();
    const expected = "/custom/path/2";

    createPaginationPages({
      edges: edges,
      createPage: createPage,
      component: "component",
      pathFormatter: pageNumber => `/custom/path/${pageNumber}`
    });

    expect(createPage.mock.calls[1][0].path).toBe(expected);
  });

  test("should allow the custom component to be used", () => {
    const edges = buildEdgeSet(30);
    const createPage = buildMock();
    const expected = "MyComponent";

    createPaginationPages({
      edges: edges,
      createPage: createPage,
      component: "MyComponent"
    });

    expect(createPage.mock.calls[0][0].component).toBe(expected);
  });
});
