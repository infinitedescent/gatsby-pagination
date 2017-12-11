import constants from "../constants";
import { DEFAULT_LIMIT } from "../constants";
import { DEFAULT_PATH_FORMATTER } from "../constants";

describe(`constants`, () => {
  test("should be require-able", () => {
    expect(constants).not.toBeUndefined();
  });

  test("should have DEFAULT_LIMIT", () => {
    expect(constants.DEFAULT_LIMIT).not.toBeUndefined();
  });

  test("should have DEFAULT_PATH_FORMATTER", () => {
    expect(constants.DEFAULT_PATH_FORMATTER).not.toBeUndefined();
  });
});

describe(`DEFAULT_LIMIT`, () => {
  test("should be require-able", () => {
    expect(DEFAULT_LIMIT).not.toBeUndefined();
  });

  test("should have value of 10", () => {
    const expected = 10;

    const result = DEFAULT_LIMIT;

    expect(result).toBe(expected);
  });
});

describe(`DEFAULT_PAGE_FORMATTER`, () => {
  test("is require-able", () => {
    expect(DEFAULT_PATH_FORMATTER).toBeTruthy();
  });

  test("should returns index local url path for page 1", () => {
    const expected = "/";

    const result = DEFAULT_PATH_FORMATTER(1);

    expect(result).toBe(expected);
  });

  test("should returns local url with slash when called for pages 2 and up", () => {
    const expected = "/2";

    const result = DEFAULT_PATH_FORMATTER(2);

    expect(result).toBe(expected);
  });
});
