import LinkedPageBuilder from "../linked-page-builder";
import PaginationPageBuilder from "../pagination-page-builder";

const buildMock = () => jest.fn().mockImplementation(value => value);
const buildEdgeSet = (size, obj = {}) =>
  Array.from(Array(size), (_, x) => Object.assign({}, obj));

describe(`LinkedPageBuilder`, () => {
  test("shuold be require-able", () => {
    expect(LinkedPageBuilder).not.toBeUndefined();
  });

  test("should instantiate", () => {
    const createPage = () => "";
    const edges = [];
    const component = "component";
    const paramsFormatter = () => {
      path: "/";
    };

    const instance = new LinkedPageBuilder(
      createPage,
      edges,
      component,
      paramsFormatter
    );

    expect(instance).not.toBeUndefined();
  });

  describe(`constructor`, () => {
    test("should error if missing 'createPage'", () => {
      const createPage = () => "";
      const edges = [];
      const component = "component";
      const paramsFormatter = () => {
        path: "/";
      };
      const expected = "Argument `createPage` must be provided.";

      expect(
        () => new LinkedPageBuilder(null, edges, component, paramsFormatter)
      ).toThrowError(expected);
    });

    test("should error if missing 'edges'", () => {
      const createPage = () => "";
      const edges = [];
      const component = "component";
      const paramsFormatter = () => {
        path: "/";
      };
      const expected = "Argument `edges` must be provided.";

      expect(
        () =>
          new LinkedPageBuilder(createPage, null, component, paramsFormatter)
      ).toThrowError(expected);
    });

    test("should error if missing 'component'", () => {
      const createPage = () => "";
      const edges = [];
      const paramsFormatter = () => {
        path: "/";
      };
      const expected = "Argument `component` must be provided.";

      expect(
        () => new LinkedPageBuilder(createPage, edges, null, paramsFormatter)
      ).toThrowError(expected);
    });

    test("should error if missing 'edgeParser'", () => {
      const createPage = () => "";
      const edges = [];
      const component = "component";
      const expected = "Argument `edgeParser` must be provided.";

      expect(
        () => new LinkedPageBuilder(createPage, edges, component, null)
      ).toThrowError(expected);
    });
  });

  describe(`setLooping`, () => {
    test("should have method", () => {
      const createPage = buildMock();
      const edges = ["a", "b", "c"];
      const component = "component";
      const paramsFormatter = jest.fn().mockImplementation(edge => ({
        path: `/${edge}`
      }));

      const instance = new LinkedPageBuilder(
        createPage,
        edges,
        component,
        paramsFormatter
      );

      expect(instance.setCircular).not.toBeUndefined();
    });

    test("should be chainable method", () => {
      const createPage = buildMock();
      const edges = ["a", "b", "c"];
      const component = "component";
      const paramsFormatter = jest.fn().mockImplementation(edge => ({
        path: `/${edge}`
      }));

      const instance = new LinkedPageBuilder(
        createPage,
        edges,
        component,
        paramsFormatter
      )
        .setCircular(true)
        .setCircular(false);
    });
  });

  describe(`build`, () => {
    test("should have method", () => {
      const createPage = buildMock();
      const edges = ["a", "b", "c"];
      const component = "component";
      const paramsFormatter = jest.fn().mockImplementation(edge => ({
        path: `/${edge}`
      }));
      const instance = new LinkedPageBuilder(
        createPage,
        edges,
        component,
        paramsFormatter
      );

      expect(instance.build).not.toBeUndefined();
    });

    test("should call edgeParser with the value of each edge", () => {
      const createPage = buildMock();
      const edges = ["a", "b", "c"];
      const component = "component";
      const paramsFormatter = jest.fn().mockImplementation(edge => ({
        path: `/${edge}`
      }));

      const instance = new LinkedPageBuilder(
        createPage,
        edges,
        component,
        paramsFormatter
      ).build();

      expect(paramsFormatter.mock.calls.length).toBe(edges.length);
      expect(paramsFormatter.mock.calls[0][0]).toBe(edges[0]);
      expect(paramsFormatter.mock.calls[1][0]).toBe(edges[1]);
      expect(paramsFormatter.mock.calls[2][0]).toBe(edges[2]);
    });

    test("should call createPage for each edge", () => {
      const createPage = buildMock();
      const edges = ["a", "b", "c"];
      const component = "component";
      const paramsFormatter = jest.fn().mockImplementation(edge => ({
        path: `/${edge}`
      }));

      new LinkedPageBuilder(
        createPage,
        edges,
        component,
        paramsFormatter
      ).build();

      expect(createPage.mock.calls.length).toBe(edges.length);
    });

    test("should call createPage with expected output from edgeParser", () => {
      const createPage = buildMock();
      const edges = ["a", "b", "c"];
      const component = "component";
      const paramsFormatter = jest.fn().mockImplementation(edge => ({
        path: `/${edge}`
      }));

      new LinkedPageBuilder(
        createPage,
        edges,
        component,
        paramsFormatter
      ).build();

      expect(createPage.mock.calls[0][0].path).toBe(`/${edges[0]}`);
      expect(createPage.mock.calls[1][0].path).toBe(`/${edges[1]}`);
      expect(createPage.mock.calls[2][0].path).toBe(`/${edges[2]}`);
    });

    test("should call createPage with combined context data", () => {
      const createPage = buildMock();
      const edges = ["a", "b", "c"];
      const component = "component";
      const paramsFormatter = jest.fn().mockImplementation(edge => ({
        path: `/${edge}`,
        context: {
          data: "myData"
        }
      }));

      new LinkedPageBuilder(
        createPage,
        edges,
        component,
        paramsFormatter
      ).build();

      expect(createPage.mock.calls[0][0].context.data).toBe("myData");
      expect(createPage.mock.calls[1][0].context.data).toBe("myData");
      expect(createPage.mock.calls[2][0].context.data).toBe("myData");
    });

    test("should call createPage without layout only when included in edgeParser output", () => {
      const createPage = buildMock();
      const edges = ["a", "b", "c"];
      const component = "component";
      const paramsFormatter = jest.fn().mockImplementation(edge => ({
        path: `/${edge}`,
        context: {
          data: "myData"
        },
        layout: edge === "b" ? undefined : `layout.${edge}`
      }));

      new LinkedPageBuilder(
        createPage,
        edges,
        component,
        paramsFormatter
      ).build();

      expect(createPage.mock.calls[0][0].layout).toBe("layout.a");
      expect(createPage.mock.calls[1][0].layout).not.toBeDefined();
      expect(createPage.mock.calls[2][0].layout).toBe("layout.c");
    });

    test("should call createPage with expected `next` results when 'circular' is disabled", () => {
      const createPage = buildMock();
      const edges = ["a", "b", "c"];
      const component = "component";
      const paramsFormatter = jest.fn().mockImplementation(edge => ({
        path: `/${edge}`
      }));

      new LinkedPageBuilder(
        createPage,
        edges,
        component,
        paramsFormatter
      ).build();

      expect(createPage.mock.calls[0][0].context.next).toBe("/b");
      expect(createPage.mock.calls[1][0].context.next).toBe("/c");
      expect(createPage.mock.calls[2][0].context.next).not.toBeDefined();
    });

    test("should call createPage with expected `prev` results when 'circular' is disabled", () => {
      const createPage = buildMock();
      const edges = ["a", "b", "c"];
      const component = "component";
      const paramsFormatter = jest.fn().mockImplementation(edge => ({
        path: `/${edge}`
      }));

      new LinkedPageBuilder(
        createPage,
        edges,
        component,
        paramsFormatter
      ).build();

      expect(createPage.mock.calls[0][0].context.prev).not.toBeDefined();
      expect(createPage.mock.calls[1][0].context.prev).toBe("/a");
      expect(createPage.mock.calls[2][0].context.prev).toBe("/b");
    });

    test("should call createPage with expected `next` results when 'circular' is enabled", () => {
      const createPage = buildMock();
      const edges = ["a", "b", "c"];
      const component = "component";
      const paramsFormatter = jest.fn().mockImplementation(edge => ({
        path: `/${edge}`
      }));

      new LinkedPageBuilder(createPage, edges, component, paramsFormatter)
        .setCircular(true)
        .build();

      expect(createPage.mock.calls[0][0].context.next).toBe("/b");
      expect(createPage.mock.calls[1][0].context.next).toBe("/c");
      expect(createPage.mock.calls[2][0].context.next).toBe("/a");
    });

    test("should call createPage with expected `prev` results when 'circular' is enabled", () => {
      const createPage = buildMock();
      const edges = ["a", "b", "c"];
      const component = "component";
      const paramsFormatter = jest.fn().mockImplementation(edge => ({
        path: `/${edge}`
      }));

      new LinkedPageBuilder(createPage, edges, component, paramsFormatter)
        .setCircular(true)
        .build();

      expect(createPage.mock.calls[0][0].context.prev).toBe("/c");
      expect(createPage.mock.calls[1][0].context.prev).toBe("/a");
      expect(createPage.mock.calls[2][0].context.prev).toBe("/b");
    });

    test("should call createPage with expected `total` results", () => {
      const createPage = buildMock();
      const edges = ["a", "b", "c"];
      const component = "component";
      const paramsFormatter = jest.fn().mockImplementation(edge => ({
        path: `/${edge}`
      }));

      new LinkedPageBuilder(
        createPage,
        edges,
        component,
        paramsFormatter
      ).build();

      expect(createPage.mock.calls[0][0].context.total).toBe(3);
      expect(createPage.mock.calls[1][0].context.total).toBe(3);
      expect(createPage.mock.calls[2][0].context.total).toBe(3);
    });
  });
});
