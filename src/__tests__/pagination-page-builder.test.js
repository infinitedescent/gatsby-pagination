import PaginationPageBuilder from "../pagination-page-builder";

describe(`PaginationPageBuilder`, () => {
  const buildMock = () => jest.fn().mockImplementation(value => value);
  const buildEdgeSet = (size, obj = {}) =>
    Array.from(Array(size), (_, x) => Object.assign({}, obj));
  const createPaginationPageBuilder = () => {
    const createPage = () => "";
    const edges = [];
    const component = "component";
    return new PaginationPageBuilder(createPage, edges, component);
  };

  test("should be require-able", () => {
    expect(PaginationPageBuilder).toBeTruthy();
  });

  test("should be constructable", () => {
    const createPage = () => "";
    const edges = [];
    const component = "component";
    expect(
      new PaginationPageBuilder(createPage, edges, component)
    ).toBeDefined();
  });

  test("should error if missing createPage", () => {
    const createPage = () => "";
    const edges = [];
    const component = "component";
    const expected = "Argument `createPage` must be provided.";

    expect(
      () => new PaginationPageBuilder(null, edges, component)
    ).toThrowError(expected);
  });

  test("should error if missing edges", () => {
    const createPage = () => "";
    const edges = [];
    const component = "component";
    const expected = "Argument `edges` must be provided.";

    expect(
      () => new PaginationPageBuilder(createPage, null, component)
    ).toThrowError(expected);
  });

  test("should error if missing component", () => {
    const createPage = () => "";
    const edges = [];
    const expected = "Argument `component` must be provided.";

    expect(
      () => new PaginationPageBuilder(createPage, edges, null)
    ).toThrowError(expected);
  });

  describe(`setLimit`, () => {
    test("should have method", () => {
      const instance = createPaginationPageBuilder();

      expect(instance.setLimit).not.toBeUndefined();
    });

    test("should take a number", () => {
      const instance = createPaginationPageBuilder();
      const input = 5;

      expect(instance.setLimit(input));
    });

    test("should override the default limit", () => {
      const createPage = buildMock();
      const edges = buildEdgeSet(100);
      const instance = new PaginationPageBuilder(
        createPage,
        edges,
        "component"
      );
      instance.setLimit(5);
      const expectedLimit = 5;
      const expectedPages = 20;

      instance.build();

      expect(createPage.mock.calls[0][0].context.limit).toBe(expectedLimit);
      expect(createPage.mock.calls[0][0].context.pages).toBe(expectedPages);
    });

    test("should be chainable", () => {
      const createPage = buildMock();
      const edges = buildEdgeSet(100);

      new PaginationPageBuilder(createPage, edges, "component")
        .setLimit(5)
        .build();
    });
  });

  describe(`setPathFormatter`, () => {
    test("should have method", () => {
      const instance = createPaginationPageBuilder();

      expect(instance.setPathFormatter).not.toBeUndefined();
    });

    test("should take a function", () => {
      const instance = createPaginationPageBuilder();
      const input = pageNumber => `/${pageNumber}`;

      expect(instance.setPathFormatter(input));
    });

    test("should override the default limit", () => {
      const createPage = buildMock();
      const pathFormatter = buildMock();
      const edges = buildEdgeSet(30);
      const instance = new PaginationPageBuilder(
        createPage,
        edges,
        "component"
      );
      instance.setPathFormatter(pathFormatter);
      const expectedCalls = 7; // 3 pages: 2 + 3 + 2

      instance.build();

      expect(pathFormatter.mock.calls.length).toBe(expectedCalls);
    });

    test("should be chainable", () => {
      const createPage = buildMock();
      const pathFormatter = buildMock();
      const edges = buildEdgeSet(30);

      new PaginationPageBuilder(createPage, edges, "component")
        .setPathFormatter(pathFormatter)
        .build();
    });
  });

  describe(`build`, () => {
    test("should have method", () => {
      const instance = createPaginationPageBuilder();

      expect(instance.build).not.toBeUndefined();
    });

    test("should execute", () => {
      const createPage = buildMock();
      const edges = buildEdgeSet(10);
      const instance = new PaginationPageBuilder(
        createPage,
        edges,
        "component"
      );

      instance.build();
    });

    test("should call createPage", () => {
      const createPage = buildMock();
      const edges = buildEdgeSet(10);
      const instance = new PaginationPageBuilder(
        createPage,
        edges,
        "component"
      );

      instance.build();

      expect(createPage.mock.calls.length).toBe(1);
      expect(createPage.mock.calls[0].length).toBe(1);
    });

    test("should call createPage with expected component", () => {
      const createPage = buildMock();
      const edges = buildEdgeSet(10);
      const instance = new PaginationPageBuilder(
        createPage,
        edges,
        "component"
      );
      const expected = "component";

      instance.build();

      expect(createPage.mock.calls[0][0].component).toBe(expected);
    });

    test("should call createPage with expected path", () => {
      const createPage = buildMock();
      const edges = buildEdgeSet(10);
      const instance = new PaginationPageBuilder(
        createPage,
        edges,
        "component"
      );
      const expected = "/";

      instance.build();

      expect(createPage.mock.calls[0][0].path).toBe(expected);
    });

    test("should call createPage with expected context.nodes", () => {
      const createPage = buildMock();
      const edges = buildEdgeSet(10);
      const instance = new PaginationPageBuilder(
        createPage,
        edges,
        "component"
      );
      const expected = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

      instance.build();

      expect(createPage.mock.calls[0][0].context.nodes).toMatchObject(expected);
    });

    test("should call createPage with expected context.page", () => {
      const createPage = buildMock();
      const edges = buildEdgeSet(10);
      const instance = new PaginationPageBuilder(
        createPage,
        edges,
        "component"
      );
      const expected = 1;

      instance.build();

      expect(createPage.mock.calls[0][0].context.page).toBe(expected);
    });

    test("should call createPage with expected context.pages", () => {
      const createPage = buildMock();
      const edges = buildEdgeSet(100);
      const instance = new PaginationPageBuilder(
        createPage,
        edges,
        "component"
      );
      const expected = 10;

      instance.build();

      expect(createPage.mock.calls[0][0].context.pages).toBe(expected);
    });

    test("should call createPage with expected context.total", () => {
      const createPage = buildMock();
      const edges = buildEdgeSet(100);
      const instance = new PaginationPageBuilder(
        createPage,
        edges,
        "component"
      );
      const expected = 100;

      instance.build();

      expect(createPage.mock.calls[0][0].context.total).toBe(expected);
    });
  });
});
