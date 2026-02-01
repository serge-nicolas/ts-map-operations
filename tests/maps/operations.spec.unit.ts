import { describe, it, expect, vi, beforeEach } from "vitest";
import { InmapClass, mapOperations } from "../../lib/InmapClass/index";

describe("InmapClass Map Operations", () => {
  let inmapClass: InmapClass;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Create a new instance for each test
    inmapClass = new InmapClass();
  });

  describe("mapOperations.merge (union)", () => {
    describe("Basic merge operations", () => {
      it("should merge two maps with no overlapping keys", () => {
        const map1 = new Map([
          ["a", 1],
          ["b", 2],
        ]);
        const map2 = new Map([
          ["c", 3],
          ["d", 4],
        ]);

        // Set initial map
        inmapClass.operation(mapOperations.merge, "testMap", map1);
        expect(inmapClass.getInMap().get("testMap")).toEqual(map1);

        // Merge with second map
        inmapClass.operation(mapOperations.merge, "testMap", map2);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.size).toBe(4);
        expect(result.get("a")).toBe(1);
        expect(result.get("b")).toBe(2);
        expect(result.get("c")).toBe(3);
        expect(result.get("d")).toBe(4);
      });

      it("should merge maps with overlapping keys (second map overwrites)", () => {
        const map1 = new Map([
          ["a", 1],
          ["b", 2],
          ["c", 3],
        ]);
        const map2 = new Map([
          ["b", 20],
          ["c", 30],
          ["d", 4],
        ]);

        inmapClass.operation(mapOperations.merge, "testMap", map1);
        inmapClass.operation(mapOperations.merge, "testMap", map2);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.size).toBe(4);
        expect(result.get("a")).toBe(1);
        expect(result.get("b")).toBe(20); // Overwritten
        expect(result.get("c")).toBe(30); // Overwritten
        expect(result.get("d")).toBe(4);
      });

      it("should merge with an empty map", () => {
        const map1 = new Map([
          ["a", 1],
          ["b", 2],
        ]);
        const emptyMap = new Map();

        inmapClass.operation(mapOperations.merge, "testMap", map1);
        inmapClass.operation(mapOperations.merge, "testMap", emptyMap);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.size).toBe(2);
        expect(result.get("a")).toBe(1);
        expect(result.get("b")).toBe(2);
      });

      it("should create a new map when key doesn't exist", () => {
        const map1 = new Map([
          ["x", 10],
          ["y", 20],
        ]);

        inmapClass.operation(mapOperations.merge, "newMap", map1);

        const result = inmapClass.getInMap().get("newMap");
        expect(result).toEqual(map1);
      });
    });

    describe("Complex data types", () => {
      it("should merge maps with object values", () => {
        const map1 = new Map([
          ["user1", { name: "Alice", age: 30 }],
          ["user2", { name: "Bob", age: 25 }],
        ]);
        const map2 = new Map([
          ["user2", { name: "Bobby", age: 26 }], // Override
          ["user3", { name: "Charlie", age: 35 }],
        ]);

        inmapClass.operation(mapOperations.merge, "users", map1);
        inmapClass.operation(mapOperations.merge, "users", map2);

        const result = inmapClass.getInMap().get("users");
        expect(result.size).toBe(3);
        expect(result.get("user1")).toEqual({ name: "Alice", age: 30 });
        expect(result.get("user2")).toEqual({ name: "Bobby", age: 26 });
        expect(result.get("user3")).toEqual({ name: "Charlie", age: 35 });
      });

      it("should merge maps with array values", () => {
        const map1 = new Map([
          ["colors", ["red", "blue"]],
          ["numbers", [1, 2, 3]],
        ]);
        const map2 = new Map([
          ["colors", ["green", "yellow"]], // Override
          ["shapes", ["circle", "square"]],
        ]);

        inmapClass.operation(mapOperations.merge, "data", map1);
        inmapClass.operation(mapOperations.merge, "data", map2);

        const result = inmapClass.getInMap().get("data");
        expect(result.size).toBe(3);
        expect(result.get("colors")).toEqual(["green", "yellow"]);
        expect(result.get("numbers")).toEqual([1, 2, 3]);
        expect(result.get("shapes")).toEqual(["circle", "square"]);
      });
    });
  });

  describe("mapOperations.intersect (intersection)", () => {
    describe("Basic intersect operations", () => {
      it("should find intersection of two maps with overlapping keys", () => {
        const map1 = new Map([
          ["a", 1],
          ["b", 2],
          ["c", 3],
        ]);
        const map2 = new Map([
          ["b", 20],
          ["c", 30],
          ["d", 4],
        ]);

        inmapClass.operation(mapOperations.merge, "testMap", map1);
        inmapClass.operation(mapOperations.intersect, "testMap", map2);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.size).toBe(2);
        expect(result.get("b")).toBe(2); // Keeps value from first map
        expect(result.get("c")).toBe(3); // Keeps value from first map
        expect(result.has("a")).toBe(false);
        expect(result.has("d")).toBe(false);
      });

      it("should return empty map when no intersection", () => {
        const map1 = new Map([
          ["a", 1],
          ["b", 2],
        ]);
        const map2 = new Map([
          ["c", 3],
          ["d", 4],
        ]);

        inmapClass.operation(mapOperations.merge, "testMap", map1);
        inmapClass.operation(mapOperations.intersect, "testMap", map2);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.size).toBe(0);
      });

      it("should handle intersection with empty map", () => {
        const map1 = new Map([
          ["a", 1],
          ["b", 2],
        ]);
        const emptyMap = new Map();

        inmapClass.operation(mapOperations.merge, "testMap", map1);
        inmapClass.operation(mapOperations.intersect, "testMap", emptyMap);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.size).toBe(0);
      });

      it("should handle intersection when initial map is empty", () => {
        const map1 = new Map([
          ["a", 1],
          ["b", 2],
        ]);

        // No initial map set, should default to empty
        inmapClass.operation(mapOperations.intersect, "testMap", map1);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.size).toBe(0);
      });
    });

    describe("Complex scenarios", () => {
      it("should preserve original values during intersection", () => {
        const map1 = new Map([
          ["id1", { name: "Item1", price: 100 }],
          ["id2", { name: "Item2", price: 200 }],
          ["id3", { name: "Item3", price: 300 }],
        ]);
        const map2 = new Map([
          ["id2", { name: "ModifiedItem2", price: 250 }],
          ["id3", { name: "ModifiedItem3", price: 350 }],
          ["id4", { name: "Item4", price: 400 }],
        ]);

        inmapClass.operation(mapOperations.merge, "inventory", map1);
        inmapClass.operation(mapOperations.intersect, "inventory", map2);

        const result = inmapClass.getInMap().get("inventory");
        expect(result.size).toBe(2);
        // Should keep original values from map1
        expect(result.get("id2")).toEqual({ name: "Item2", price: 200 });
        expect(result.get("id3")).toEqual({ name: "Item3", price: 300 });
      });
    });
  });

  describe("mapOperations.difference", () => {
    describe("Basic difference operations", () => {
      it("should find difference between two maps", () => {
        const map1 = new Map([
          ["a", 1],
          ["b", 2],
          ["c", 3],
          ["d", 4],
        ]);
        const map2 = new Map([
          ["b", 20],
          ["d", 40],
        ]);

        inmapClass.operation(mapOperations.merge, "testMap", map1);
        inmapClass.operation(mapOperations.difference, "testMap", map2);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.size).toBe(2);
        expect(result.get("a")).toBe(1);
        expect(result.get("c")).toBe(3);
        expect(result.has("b")).toBe(false);
        expect(result.has("d")).toBe(false);
      });

      it("should return original map when subtracting empty map", () => {
        const map1 = new Map([
          ["a", 1],
          ["b", 2],
        ]);
        const emptyMap = new Map();

        inmapClass.operation(mapOperations.merge, "testMap", map1);
        inmapClass.operation(mapOperations.difference, "testMap", emptyMap);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.size).toBe(2);
        expect(result.get("a")).toBe(1);
        expect(result.get("b")).toBe(2);
      });

      it("should return empty map when all keys are removed", () => {
        const map1 = new Map([
          ["a", 1],
          ["b", 2],
        ]);
        const map2 = new Map([
          ["a", 10],
          ["b", 20],
          ["c", 30],
        ]);

        inmapClass.operation(mapOperations.merge, "testMap", map1);
        inmapClass.operation(mapOperations.difference, "testMap", map2);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.size).toBe(0);
      });

      it("should handle difference with no common keys", () => {
        const map1 = new Map([
          ["a", 1],
          ["b", 2],
        ]);
        const map2 = new Map([
          ["c", 3],
          ["d", 4],
        ]);

        inmapClass.operation(mapOperations.merge, "testMap", map1);
        inmapClass.operation(mapOperations.difference, "testMap", map2);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.size).toBe(2);
        expect(result.get("a")).toBe(1);
        expect(result.get("b")).toBe(2);
      });
    });

    describe("Use case scenarios", () => {
      it("should filter active users", () => {
        const allUsers = new Map([
          ["user1", { name: "Alice", active: true }],
          ["user2", { name: "Bob", active: false }],
          ["user3", { name: "Charlie", active: true }],
          ["user4", { name: "David", active: false }],
        ]);

        const inactiveUsers = new Map([
          ["user2", {}],
          ["user4", {}],
        ]);

        inmapClass.operation(mapOperations.merge, "activeUsers", allUsers);
        inmapClass.operation(
          mapOperations.difference,
          "activeUsers",
          inactiveUsers,
        );

        const result = inmapClass.getInMap().get("activeUsers");
        expect(result.size).toBe(2);
        expect(result.has("user1")).toBe(true);
        expect(result.has("user3")).toBe(true);
      });
    });
  });

  describe("mapOperations.mergeAndSum", () => {
    describe("Basic mergeAndSum operations", () => {
      it("should merge and sum numeric values with overlapping keys", () => {
        const map1 = new Map([
          ["a", 10],
          ["b", 20],
          ["c", 30],
        ]);
        const map2 = new Map([
          ["b", 5],
          ["c", 15],
          ["d", 40],
        ]);

        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map1);
        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map2);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.size).toBe(4);
        expect(result.get("a")).toBe(10); // No overlap, keeps original
        expect(result.get("b")).toBe(25); // 20 + 5 = 25
        expect(result.get("c")).toBe(45); // 30 + 15 = 45
        expect(result.get("d")).toBe(40); // New key from map2
      });

      it("should add new keys when no overlap exists", () => {
        const map1 = new Map([
          ["x", 100],
          ["y", 200],
        ]);
        const map2 = new Map([
          ["z", 300],
          ["w", 400],
        ]);

        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map1);
        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map2);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.size).toBe(4);
        expect(result.get("x")).toBe(100);
        expect(result.get("y")).toBe(200);
        expect(result.get("z")).toBe(300);
        expect(result.get("w")).toBe(400);
      });

      it("should handle merging with empty map", () => {
        const map1 = new Map([
          ["a", 50],
          ["b", 100],
        ]);
        const emptyMap = new Map();

        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map1);
        inmapClass.operation(mapOperations.mergeAndSum, "testMap", emptyMap);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.size).toBe(2);
        expect(result.get("a")).toBe(50);
        expect(result.get("b")).toBe(100);
      });

      it("should handle negative numbers in sum", () => {
        const map1 = new Map([
          ["a", 100],
          ["b", -50],
          ["c", 25],
        ]);
        const map2 = new Map([
          ["a", -30],
          ["b", -20],
          ["c", 25],
        ]);

        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map1);
        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map2);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.get("a")).toBe(70); // 100 + (-30) = 70
        expect(result.get("b")).toBe(-70); // -50 + (-20) = -70
        expect(result.get("c")).toBe(50); // 25 + 25 = 50
      });

      it("should handle decimal numbers", () => {
        const map1 = new Map([
          ["price1", 19.99],
          ["price2", 5.5],
        ]);
        const map2 = new Map([
          ["price1", 0.01],
          ["price2", 4.5],
          ["price3", 10.0],
        ]);

        inmapClass.operation(mapOperations.mergeAndSum, "prices", map1);
        inmapClass.operation(mapOperations.mergeAndSum, "prices", map2);

        const result = inmapClass.getInMap().get("prices");
        expect(result.get("price1")).toBeCloseTo(20.0, 2);
        expect(result.get("price2")).toBeCloseTo(10.0, 2);
        expect(result.get("price3")).toBe(10.0);
      });
    });

    describe("Mixed data types", () => {
      it("should overwrite non-numeric values instead of summing", () => {
        const map1 = new Map<string, any>([
          ["numeric", 100],
          ["string", "hello"],
          ["mixed", 50],
        ]);
        const map2 = new Map<string, any>([
          ["numeric", 50],
          ["string", "world"],
          ["mixed", "now a string"],
        ]);

        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map1);
        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map2);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.get("numeric")).toBe(150); // Both numbers, summed
        expect(result.get("string")).toBe("world"); // Both strings, overwritten
        expect(result.get("mixed")).toBe("now a string"); // Mixed types, overwritten
      });

      it("should handle objects and arrays correctly", () => {
        const map1 = new Map<string, any>([
          ["count", 5],
          ["items", ["a", "b"]],
          ["data", { value: 100 }],
        ]);
        const map2 = new Map<string, any>([
          ["count", 10],
          ["items", ["c", "d"]],
          ["data", { value: 200 }],
        ]);

        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map1);
        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map2);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.get("count")).toBe(15); // Numbers summed
        expect(result.get("items")).toEqual(["c", "d"]); // Array overwritten
        expect(result.get("data")).toEqual({ value: 200 }); // Object overwritten
      });

      it("should handle null and undefined values", () => {
        const map1 = new Map([
          ["a", 10],
          ["b", null],
          ["c", undefined],
        ]);
        const map2 = new Map([
          ["a", 5],
          ["b", 20],
          ["c", 30],
        ]);

        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map1);
        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map2);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.get("a")).toBe(15); // Numbers summed
        expect(result.get("b")).toBe(20); // null overwritten
        expect(result.get("c")).toBe(30); // undefined overwritten
      });

      it("should handle boolean values", () => {
        const map1 = new Map<string, any>([
          ["flag1", true],
          ["flag2", false],
          ["count", 5],
        ]);
        const map2 = new Map<string, any>([
          ["flag1", false],
          ["flag2", true],
          ["count", 3],
        ]);

        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map1);
        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map2);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.get("flag1")).toBe(false); // Booleans overwritten
        expect(result.get("flag2")).toBe(true);
        expect(result.get("count")).toBe(8); // Numbers summed
      });
    });

    describe("Real-world use cases", () => {
      it("should aggregate sales data", () => {
        const january = new Map<string, any>([
          ["productA", 100],
          ["productB", 250],
          ["productC", 75],
        ]);
        const february = new Map<string, any>([
          ["productA", 150],
          ["productB", 200],
          ["productD", 300],
        ]);
        const march = new Map<string, any>([
          ["productA", 125],
          ["productC", 100],
          ["productD", 250],
        ]);

        inmapClass.operation(mapOperations.mergeAndSum, "totalSales", january);
        inmapClass.operation(mapOperations.mergeAndSum, "totalSales", february);
        inmapClass.operation(mapOperations.mergeAndSum, "totalSales", march);

        const result = inmapClass.getInMap().get("totalSales");
        expect(result.get("productA")).toBe(375); // 100 + 150 + 125
        expect(result.get("productB")).toBe(450); // 250 + 200
        expect(result.get("productC")).toBe(175); // 75 + 100
        expect(result.get("productD")).toBe(550); // 300 + 250
      });

      it("should combine inventory counts", () => {
        const warehouse1 = new Map([
          ["item1", 50],
          ["item2", 30],
          ["item3", 0],
        ]);
        const warehouse2 = new Map([
          ["item1", 25],
          ["item3", 15],
          ["item4", 100],
        ]);

        inmapClass.operation(
          mapOperations.mergeAndSum,
          "totalInventory",
          warehouse1,
        );
        inmapClass.operation(
          mapOperations.mergeAndSum,
          "totalInventory",
          warehouse2,
        );

        const result = inmapClass.getInMap().get("totalInventory");
        expect(result.get("item1")).toBe(75);
        expect(result.get("item2")).toBe(30);
        expect(result.get("item3")).toBe(15);
        expect(result.get("item4")).toBe(100);
      });

      it("should aggregate statistics", () => {
        const player1Stats = new Map([
          ["points", 120],
          ["assists", 45],
          ["rebounds", 30],
          // ["name", "Player 1"],
        ]);
        const player2Stats = new Map([
          ["points", 85],
          ["assists", 60],
          ["steals", 15],
          // ["name", "Player 2"],
        ]);

        inmapClass.operation(
          mapOperations.mergeAndSum,
          "teamStats",
          player1Stats,
        );
        inmapClass.operation(
          mapOperations.mergeAndSum,
          "teamStats",
          player2Stats,
        );

        const result = inmapClass.getInMap().get("teamStats");
        expect(result.get("points")).toBe(205);
        expect(result.get("assists")).toBe(105);
        expect(result.get("rebounds")).toBe(30);
        expect(result.get("steals")).toBe(15);
        expect(result.get("name")).toBe("Player 2"); // String overwritten
      });
    });

    describe("Sequential operations", () => {
      it("should accumulate values across multiple mergeAndSum operations", () => {
        const batch1 = new Map([["total", 100]]);
        const batch2 = new Map([["total", 50]]);
        const batch3 = new Map([["total", 25]]);
        const batch4 = new Map([["total", 125]]);

        inmapClass.operation(mapOperations.mergeAndSum, "accumulator", batch1);
        inmapClass.operation(mapOperations.mergeAndSum, "accumulator", batch2);
        inmapClass.operation(mapOperations.mergeAndSum, "accumulator", batch3);
        inmapClass.operation(mapOperations.mergeAndSum, "accumulator", batch4);

        const result = inmapClass.getInMap().get("accumulator");
        expect(result.get("total")).toBe(300); // 100 + 50 + 25 + 125
      });

      it("should handle zero values correctly", () => {
        const map1 = new Map([
          ["a", 0],
          ["b", 100],
        ]);
        const map2 = new Map([
          ["a", 50],
          ["b", 0],
        ]);

        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map1);
        inmapClass.operation(mapOperations.mergeAndSum, "testMap", map2);

        const result = inmapClass.getInMap().get("testMap");
        expect(result.get("a")).toBe(50); // 0 + 50
        expect(result.get("b")).toBe(100); // 100 + 0
      });
    });
  });

  describe("Multiple operations on different keys", () => {
    it("should maintain separate maps for different keys", () => {
      const map1 = new Map([
        ["a", 1],
        ["b", 2],
      ]);
      const map2 = new Map([
        ["c", 3],
        ["d", 4],
      ]);
      const map3 = new Map([
        ["e", 5],
        ["f", 6],
      ]);

      inmapClass.operation(mapOperations.merge, "map1", map1);
      inmapClass.operation(mapOperations.merge, "map2", map2);
      inmapClass.operation(mapOperations.merge, "map3", map3);

      expect(inmapClass.getInMap().get("map1")).toEqual(map1);
      expect(inmapClass.getInMap().get("map2")).toEqual(map2);
      expect(inmapClass.getInMap().get("map3")).toEqual(map3);
      expect(inmapClass.getInMap().size).toBe(3);
    });
  });

  describe("Chaining operations", () => {
    it("should handle multiple operations in sequence", () => {
      const initial = new Map([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ]);

      const toMerge = new Map([
        ["d", 4],
        ["e", 5],
      ]);

      const toIntersect = new Map([
        ["a", 10],
        ["c", 30],
        ["d", 40],
        ["f", 60],
      ]);

      // Start with initial map
      inmapClass.operation(mapOperations.merge, "testMap", initial);

      // Merge: should have a,b,c,d,e
      inmapClass.operation(mapOperations.merge, "testMap", toMerge);
      let result = inmapClass.getInMap().get("testMap");
      expect(result.size).toBe(5);

      // Intersect: should only keep a,c,d (common keys)
      inmapClass.operation(mapOperations.intersect, "testMap", toIntersect);
      result = inmapClass.getInMap().get("testMap");
      expect(result.size).toBe(3);
      expect(result.has("a")).toBe(true);
      expect(result.has("c")).toBe(true);
      expect(result.has("d")).toBe(true);
      expect(result.has("b")).toBe(false);
      expect(result.has("e")).toBe(false);
    });

    it("should build complex filtering pipeline", () => {
      const products = new Map([
        ["p1", { name: "Product1", category: "electronics", price: 100 }],
        ["p2", { name: "Product2", category: "clothing", price: 50 }],
        ["p3", { name: "Product3", category: "electronics", price: 200 }],
        ["p4", { name: "Product4", category: "food", price: 20 }],
        ["p5", { name: "Product5", category: "electronics", price: 150 }],
      ]);

      const expensiveProducts = new Map([
        ["p1", {}],
        ["p3", {}],
        ["p5", {}],
      ]);

      const excludeList = new Map([
        ["p3", {}], // Exclude this specific product
      ]);

      // Start with all products
      inmapClass.operation(mapOperations.merge, "filtered", products);

      // Keep only expensive products (intersection)
      inmapClass.operation(
        mapOperations.intersect,
        "filtered",
        expensiveProducts,
      );

      // Remove excluded products (difference)
      inmapClass.operation(mapOperations.difference, "filtered", excludeList);

      const result = inmapClass.getInMap().get("filtered");
      expect(result.size).toBe(2);
      expect(result.has("p1")).toBe(true);
      expect(result.has("p5")).toBe(true);
      expect(result.has("p3")).toBe(false); // Excluded
    });
  });

  describe("Error handling", () => {
    it("should throw error when trying to merge with non-Map value at key", () => {
      // Set a non-Map value at the key
      inmapClass.getInMap().set("notAMap", "string value");

      const mapToMerge = new Map([["a", 1]]);

      expect(() => {
        inmapClass.operation(mapOperations.merge, "notAMap", mapToMerge);
      }).toThrow(TypeError);
      expect(() => {
        inmapClass.operation(mapOperations.merge, "notAMap", mapToMerge);
      }).toThrow("Value at key 'notAMap' is not a Map");
    });

    it("should throw error when trying to intersect with non-Map value at key", () => {
      inmapClass.getInMap().set("notAMap", 123);

      const mapToIntersect = new Map([["a", 1]]);

      expect(() => {
        inmapClass.operation(
          mapOperations.intersect,
          "notAMap",
          mapToIntersect,
        );
      }).toThrow(TypeError);
      expect(() => {
        inmapClass.operation(
          mapOperations.intersect,
          "notAMap",
          mapToIntersect,
        );
      }).toThrow("Value at key 'notAMap' is not a Map");
    });

    it("should throw error when trying to difference with non-Map value at key", () => {
      inmapClass.getInMap().set("notAMap", { not: "a map" });

      const mapToDiff = new Map([["a", 1]]);

      expect(() => {
        inmapClass.operation(mapOperations.difference, "notAMap", mapToDiff);
      }).toThrow(TypeError);
      expect(() => {
        inmapClass.operation(mapOperations.difference, "notAMap", mapToDiff);
      }).toThrow("Value at key 'notAMap' is not a Map");
    });

    it("should throw error when trying to mergeAndSum with non-Map value at key", () => {
      inmapClass.getInMap().set("notAMap", "not a map");

      const mapToMerge = new Map([["a", 10]]);

      expect(() => {
        inmapClass.operation(mapOperations.mergeAndSum, "notAMap", mapToMerge);
      }).toThrow(TypeError);
      expect(() => {
        inmapClass.operation(mapOperations.mergeAndSum, "notAMap", mapToMerge);
      }).toThrow("Value at key 'notAMap' is not a Map");
    });
  });

  describe("Return values", () => {
    it("should return the main Map after each operation", () => {
      const mergeSpy = vi.spyOn(inmapClass as any, "operationMerge");
      const map1 = new Map([["a", 1]]);

      inmapClass.operation(mapOperations.merge, "key", map1);

      expect(mergeSpy).toHaveReturnedWith(inmapClass.getInMap());
      expect(inmapClass.getInMap()).toBeInstanceOf(Map);
      expect(inmapClass.getInMap().get("key")).toEqual(map1);
    });
  });
});
