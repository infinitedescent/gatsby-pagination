import gatsbyPagination from "../index";
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
  test("is not require-able", () => {
    expect(gatsbyPagination).toBeUndefined();
  });
});

describe(`createPaginationPages`, () => {
  test("is require-able", () => {
    expect(createPaginationPages).not.toBeUndefined();
  });

  describe(`should call "createPage" callback`, () => {
    test("with expected default values when required parameters are set", () => {
      const edges = buildEdgeSet(1);
      const createPage = buildMock();
      const component = "component";
      const expected = {
        component: "component",
        context: {
          limit: 10,
          nodes: edges,
          page: 1,
          pages: 1,
          total: 1
        },
        path: "/"
      };

      createPaginationPages({
        edges,
        createPage,
        component
      });

      expect(createPage.mock.calls.length).toBe(1);
      expect(createPage.mock.calls[0].length).toBe(1);
      expect(createPage.mock.calls[0][0]).toMatchObject(expected);
    });

    test("with 'context.component' set to 'component' value", () => {
      const edges = buildEdgeSet(1);
      const createPage = buildMock();
      const expected = "component path";

      createPaginationPages({
        edges: edges,
        createPage: createPage,
        component: "component path"
      });

      expect(createPage.mock.calls[0][0].component).toBeDefined();
      expect(createPage.mock.calls[0][0].component).toBe(expected);
    });

    test("with 'context.limit' set to default value", () => {
      const edges = buildEdgeSet(1);
      const createPage = buildMock();
      const expected = 10;

      createPaginationPages({
        edges: edges,
        createPage: createPage,
        component: "component"
      });

      expect(createPage.mock.calls[0][0].context.limit).toBeDefined();
      expect(createPage.mock.calls[0][0].context.limit).toBe(expected);
    });

    test("with 'context.limit' set to 'limit' value", () => {
      const edges = buildEdgeSet(1);
      const createPage = buildMock();
      const expected = 42;

      createPaginationPages({
        edges: edges,
        createPage: createPage,
        component: "component",
        limit: 42
      });

      expect(createPage.mock.calls[0][0].context.limit).toBeDefined();
      expect(createPage.mock.calls[0][0].context.limit).toBe(expected);
    });

    test("once per Edge", () => {
      const expected = 4;

      const createPage = runEdgeTest();

      expect(createPage.mock.calls.length).toBe(expected);
    });

    describe(`where each Edge`, () => {
      test("should have component of component use to generate all pages", () => {
        const expected = "component";

        const createPage = runEdgeTest();

        expect(createPage.mock.calls[0][0].component).toBe(expected);
        expect(createPage.mock.calls[1][0].component).toBe(expected);
        expect(createPage.mock.calls[2][0].component).toBe(expected);
        expect(createPage.mock.calls[3][0].component).toBe(expected);
      });

      test("should forward the limit to all pages", () => {
        const expected = 2;

        const createPage = runEdgeTest();

        expect(createPage.mock.calls[0][0].context.limit).toBe(expected);
        expect(createPage.mock.calls[1][0].context.limit).toBe(expected);
        expect(createPage.mock.calls[2][0].context.limit).toBe(expected);
        expect(createPage.mock.calls[3][0].context.limit).toBe(expected);
      });

      test("should provide the total number of nodes to all pages", () => {
        const expected = 7;

        const createPage = runEdgeTest();

        expect(createPage.mock.calls[0][0].context.total).toBe(expected);
        expect(createPage.mock.calls[1][0].context.total).toBe(expected);
        expect(createPage.mock.calls[2][0].context.total).toBe(expected);
        expect(createPage.mock.calls[3][0].context.total).toBe(expected);
      });

      test("should provide the total number of pages to all pages", () => {
        const expected = 4;

        const createPage = runEdgeTest();

        expect(createPage.mock.calls[0][0].context.pages).toBe(expected);
        expect(createPage.mock.calls[1][0].context.pages).toBe(expected);
        expect(createPage.mock.calls[2][0].context.pages).toBe(expected);
        expect(createPage.mock.calls[3][0].context.pages).toBe(expected);
      });
    });

    describe(`where page 1 of 4 (first)`, () => {
      test("should have path to page", () => {
        const expected = "/";

        const createPage = runEdgeTest();

        expect(createPage.mock.calls[0][0].path).toBe(expected);
      });

      describe(`context`, () => {
        test("should have Edge nodes for page", () => {
          const expected = [{}, {}];

          const createPage = runEdgeTest();

          expect(createPage.mock.calls[0][0].context.nodes).toMatchObject(
            expected
          );
        });

        test("should have base-1 page number of current page", () => {
          const expected = 1;

          const createPage = runEdgeTest();

          expect(createPage.mock.calls[0][0].context.page).toBe(expected);
        });

        test("should not have path to prev page", () => {
          const expected = "1";

          const createPage = runEdgeTest();

          expect(createPage.mock.calls[0][0].context.prev).toBeUndefined();
        });

        test("should have path to next page", () => {
          const expected = "/2";

          const createPage = runEdgeTest();

          expect(createPage.mock.calls[0][0].context.next).toBe(expected);
        });
      });
    });

    describe(`where page 2 of 4 (first numbered)`, () => {
      test("should have path to page", () => {
        const expected = "/2";

        const createPage = runEdgeTest();

        expect(createPage.mock.calls[1][0].path).toBe(expected);
      });

      test("should have component", () => {
        const expected = "component";

        const createPage = runEdgeTest();

        expect(createPage.mock.calls[1][0].component).toBe(expected);
      });

      describe(`context`, () => {
        test("should have Edge nodes for page", () => {
          const expected = [{}, {}];

          const createPage = runEdgeTest();

          expect(createPage.mock.calls[1][0].context.nodes).toMatchObject(
            expected
          );
        });

        test("should have base-1 page number of current page", () => {
          const expected = 2;

          const createPage = runEdgeTest();

          expect(createPage.mock.calls[1][0].context.page).toBe(expected);
        });

        test("should have path to prev page", () => {
          const expected = "/";

          const createPage = runEdgeTest();

          expect(createPage.mock.calls[1][0].context.prev).toBe(expected);
        });

        test("should have path to next page", () => {
          const expected = "/3";

          const createPage = runEdgeTest();

          expect(createPage.mock.calls[1][0].context.next).toBe(expected);
        });
      });
    });

    describe(`where page 3 of 4 (middle numbered)`, () => {
      test("should have path to page", () => {
        const expected = "/3";

        const createPage = runEdgeTest();

        expect(createPage.mock.calls[2][0].path).toBe(expected);
      });

      test("should have expected component", () => {
        const expected = "component";

        const createPage = runEdgeTest();

        expect(createPage.mock.calls[2][0].component).toBe(expected);
      });

      describe(`context`, () => {
        test("should have Edge nodes for page", () => {
          const expected = [{}, {}];

          const createPage = runEdgeTest();

          expect(createPage.mock.calls[2][0].context.nodes).toMatchObject(
            expected
          );
        });

        test("should have base-1 page number of current page", () => {
          const expected = 3;

          const createPage = runEdgeTest();

          expect(createPage.mock.calls[2][0].context.page).toBe(expected);
        });

        test("should have path to prev page", () => {
          const expected = "/2";

          const createPage = runEdgeTest();

          expect(createPage.mock.calls[2][0].context.prev).toBe(expected);
        });

        test("should have path to next page", () => {
          const expected = "/4";

          const createPage = runEdgeTest();

          expect(createPage.mock.calls[2][0].context.next).toBe(expected);
        });
      });
    });

    describe(`where page 4 of 4 (last)`, () => {
      test("should have path to page", () => {
        const expected = "/4";

        const createPage = runEdgeTest();

        expect(createPage.mock.calls[3][0].path).toBe(expected);
      });

      test("should have expected component", () => {
        const expected = "component";

        const createPage = runEdgeTest();

        expect(createPage.mock.calls[3][0].component).toBe(expected);
      });

      describe(`context`, () => {
        test("should have last Edge node for page", () => {
          const expected = [{}];

          const createPage = runEdgeTest();

          expect(createPage.mock.calls[3][0].context.nodes).toMatchObject(
            expected
          );
        });

        test("should have base-1 page number of current page", () => {
          const expected = 4;

          const createPage = runEdgeTest();

          expect(createPage.mock.calls[3][0].context.page).toBe(expected);
        });

        test("should have path to prev page", () => {
          const expected = "/3";

          const createPage = runEdgeTest();

          expect(createPage.mock.calls[3][0].context.prev).toBe(expected);
        });

        test("should not have path to next page", () => {
          const createPage = runEdgeTest();

          expect(createPage.mock.calls[3][0].context.next).toBeUndefined();
        });
      });
    });

    test("should calls use defined path formatter", () => {
      const edges = buildEdgeSet(1);
      const createPage = buildMock();
      const pathFormatter = buildMock();

      createPaginationPages({
        edges: edges,
        createPage: createPage,
        component: "component",
        pathFormatter: pathFormatter
      });

      expect(pathFormatter).toHaveBeenCalled();
    });
  });

  describe(`prefixPathFormatter`, () => {
    test("is require-able", () => {
      expect(prefixPathFormatter).not.toBeUndefined();
    });
  });

  describe(`test createPaginationPages works with prefixPathFormatter`, () => {
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
