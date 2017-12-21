import gatsbyPagination from "../index";
import { createPaginationPages } from "../index";
import { createLinkedPages } from "../index";
import { prefixPathFormatter } from "../index";

describe(`gatsby-pagination`, () => {
  test("is not require-able", () => {
    expect(gatsbyPagination).toBeUndefined();
  });
});

describe(`createPaginationPages`, () => {
  test("is require-able", () => {
    expect(createPaginationPages).not.toBeUndefined();
  });
});

describe(`createLinkedPages`, () => {
  test("is require-able", () => {
    expect(createLinkedPages).not.toBeUndefined();
  });
});

describe(`prefixPathFormatter`, () => {
  test("is require-able", () => {
    expect(prefixPathFormatter).not.toBeUndefined();
  });
});
