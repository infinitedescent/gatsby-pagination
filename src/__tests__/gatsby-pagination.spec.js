import { createPaginationPages } from "../index";
import { prefixPathFormatter } from "../index";
import { createLinkedPages } from "../index";

const buildMock = () => jest.fn().mockImplementation(value => value);
const buildEdgeSet = (size, obj = {}) =>
  Array.from(Array(size), (_, x) => JSON.parse(JSON.stringify(obj)));
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
  describe(`createPaginatedPages`, () => {
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

  describe(`prefixPathFormatter`, () => {
    describe(`should allow users to append a prefix before paginated page paths`, () => {
      test("should return paths appended with prefix", () => {
        expect(prefixPathFormatter).not.toBeUndefined();

        const edges = buildEdgeSet(1);
        const createPage = buildMock();
        const expected = {
          component: "component",
          context: {
            limit: 10,
            nodes: edges,
            page: 1,
            pages: 1,
            total: 1
          },
          path: "prefix/"
        };

        createPaginationPages({
          edges: edges,
          createPage: createPage,
          component: "component",
          pathFormatter: prefixPathFormatter("prefix")
        });

        expect(createPage.mock.calls.length).toBe(1);
        expect(createPage.mock.calls[0].length).toBe(1);
        expect(createPage.mock.calls[0][0]).toMatchObject(expected);
      });
    });
  });

  const runCreateLinkedPages = (edges, circular = false) => {
    const createPage = buildMock();
    const edgeParser = edge => ({
      path: `/${edge.node.fields.slug}`,
      context: {
        slug: edge.node.fields.slug
      }
    });

    createLinkedPages({
      edges: edges,
      createPage: createPage,
      component: "MyComponent",
      edgeParser: edgeParser,
      circular: circular
    });

    return createPage;
  };

  describe(`createLinkedPages`, () => {
    test("should call createdPage for each edge and provide `prev` via the context if previous page is exists)", () => {
      const edges = buildEdgeSet(3, { node: { fields: { slug: "" } } });
      edges[0].node.fields.slug = "a";
      edges[1].node.fields.slug = "b";
      edges[2].node.fields.slug = "c";

      const createPage = runCreateLinkedPages(edges);

      expect(createPage.mock.calls[0][0].context.prev).not.toBeDefined();
      expect(createPage.mock.calls[1][0].context.prev).toBe(`/a`);
      expect(createPage.mock.calls[2][0].context.prev).toBe(`/b`);
    });

    test("should call createdPage for each edge and provide `next` via the context if next page is exists)", () => {
      const edges = buildEdgeSet(3, { node: { fields: { slug: "" } } });
      edges[0].node.fields.slug = "a";
      edges[1].node.fields.slug = "b";
      edges[2].node.fields.slug = "c";

      const createPage = runCreateLinkedPages(edges);

      expect(createPage.mock.calls[0][0].context.next).toBe("/b");
      expect(createPage.mock.calls[1][0].context.next).toBe("/c");
      expect(createPage.mock.calls[2][0].context.next).not.toBeDefined();
    });

    test("should support circular option to link the first and last nodes.", () => {
      const edges = buildEdgeSet(3, { node: { fields: { slug: "" } } });
      edges[0].node.fields.slug = "a";
      edges[1].node.fields.slug = "b";
      edges[2].node.fields.slug = "c";

      const createPage = runCreateLinkedPages(edges, true);

      expect(createPage.mock.calls[0][0].context.prev).toBe("/c");
      expect(createPage.mock.calls[2][0].context.next).toBe("/a");
    });

    test("should call createdPage for each edge and provide `total` via the context", () => {
      const edges = buildEdgeSet(3, { node: { fields: { slug: "" } } });
      edges[0].node.fields.slug = "a";
      edges[1].node.fields.slug = "b";
      edges[2].node.fields.slug = "c";

      const createPage = runCreateLinkedPages(edges);

      expect(createPage.mock.calls[0][0].context.total).toBe(3);
      expect(createPage.mock.calls[1][0].context.total).toBe(3);
      expect(createPage.mock.calls[2][0].context.total).toBe(3);
    });

    test("should allow the custom component to be used", () => {
      const edges = buildEdgeSet(3, { node: { fields: { slug: "" } } });
      edges[0].node.fields.slug = "a";
      edges[1].node.fields.slug = "b";
      edges[2].node.fields.slug = "c";
      const expected = "MyComponent";

      const createPage = runCreateLinkedPages(edges);

      expect(createPage.mock.calls[0][0].component).toBe(expected);
    });

    test("should allow th ability for each page's path to be set", () => {
      const edges = buildEdgeSet(3, { node: { fields: { slug: "" } } });
      edges[0].node.fields.slug = "a";
      edges[1].node.fields.slug = "b";
      edges[2].node.fields.slug = "c";

      const createPage = runCreateLinkedPages(edges);

      expect(createPage.mock.calls[0][0].path).toBe("/a");
      expect(createPage.mock.calls[1][0].path).toBe("/b");
      expect(createPage.mock.calls[2][0].path).toBe("/c");
    });

    test("should allow the ability to set each page's context", () => {
      const edges = buildEdgeSet(3, { node: { fields: { slug: "" } } });
      edges[0].node.fields.slug = "a";
      edges[1].node.fields.slug = "b";
      edges[2].node.fields.slug = "c";

      const createPage = runCreateLinkedPages(edges);

      expect(createPage.mock.calls[0][0].context.slug).toBe("a");
      expect(createPage.mock.calls[1][0].context.slug).toBe("b");
      expect(createPage.mock.calls[2][0].context.slug).toBe("c");
    });
  });
});
