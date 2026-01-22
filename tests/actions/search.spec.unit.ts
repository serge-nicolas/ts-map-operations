import { describe, it, expect, vi, beforeEach } from "vitest";
import { InmapClass, mapOperations } from "../../lib/InmapClass/index";

describe("InmapClass", () => {
  let inmap: InmapClass;

  beforeEach(() => {
    inmap = new InmapClass();
  });

  it("should search by key", () => {
    inmap.set("key1", "value1");
    inmap.set("key2", "value2");
    inmap.set("key3", "value3");

    const result = inmap.searchByKey(/key/);

    expect(result).toEqual(["value1", "value2", "value3"]);
  });

  it("should search by key with multiple matches", () => {
    inmap.set("key1", "value1");
    inmap.set("key2", "value2");
    inmap.set("key3", "value3");

    const result = inmap.searchByKey(/key/);

    expect(result).toEqual(["value1", "value2", "value3"]);
  });

  it("should search by key with no matches", () => {
    inmap.set("key1", "value1");
    inmap.set("key2", "value2");
    inmap.set("key3", "value3");

    const result = inmap.searchByKey(/notfound/);

    expect(result).toEqual([]);
  });
});
