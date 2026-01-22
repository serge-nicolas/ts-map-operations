import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  InmapClass,
  StringOperations,
} from "../../lib/InmapClass/index";

describe("InmapClass String Operations", () => {
  let inmapClass: InmapClass;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Create a new instance for each test
    inmapClass = new InmapClass();
  });

  describe("StringOperations.concat", () => {
    describe("Basic concatenation", () => {
      it("should concatenate strings with default empty initial value", () => {
        inmapClass.operation(StringOperations.concat, "key1", "Hello");
        expect(inmapClass.getInMap().get("key1")).toBe("Hello");
      });

      it("should concatenate multiple strings sequentially", () => {
        inmapClass.operation(StringOperations.concat, "key1", "Hello");
        inmapClass.operation(StringOperations.concat, "key1", " ");
        inmapClass.operation(StringOperations.concat, "key1", "World");
        expect(inmapClass.getInMap().get("key1")).toBe("Hello World");
      });

      it("should handle empty string concatenation", () => {
        inmapClass.operation(StringOperations.concat, "key1", "");
        expect(inmapClass.getInMap().get("key1")).toBe("");

        inmapClass.operation(StringOperations.concat, "key1", "text");
        expect(inmapClass.getInMap().get("key1")).toBe("text");

        inmapClass.operation(StringOperations.concat, "key1", "");
        expect(inmapClass.getInMap().get("key1")).toBe("text");
      });
    });

    describe("Special characters and unicode", () => {
      it("should handle newlines and tabs", () => {
        inmapClass.operation(StringOperations.concat, "key1", "Line 1\n");
        inmapClass.operation(StringOperations.concat, "key1", "\tIndented");
        inmapClass.operation(StringOperations.concat, "key1", "\nLine 2");
        expect(inmapClass.getInMap().get("key1")).toBe("Line 1\n\tIndented\nLine 2");
      });

      it("should handle special characters", () => {
        const specialChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~";
        inmapClass.operation(StringOperations.concat, "key1", specialChars);
        expect(inmapClass.getInMap().get("key1")).toBe(specialChars);
      });

      it("should handle unicode characters and emojis", () => {
        inmapClass.operation(StringOperations.concat, "key1", "Hello 👋 ");
        inmapClass.operation(StringOperations.concat, "key1", "世界 ");
        inmapClass.operation(StringOperations.concat, "key1", "🌍 ");
        inmapClass.operation(StringOperations.concat, "key1", "مرحبا ");
        inmapClass.operation(StringOperations.concat, "key1", "🎉");
        expect(inmapClass.getInMap().get("key1")).toBe("Hello 👋 世界 🌍 مرحبا 🎉");
      });

      it("should handle escaped characters", () => {
        inmapClass.operation(StringOperations.concat, "key1", "Line with \\n escape");
        inmapClass.operation(StringOperations.concat, "key1", " and \\t tab");
        expect(inmapClass.getInMap().get("key1")).toBe("Line with \\n escape and \\t tab");
      });

      it("should handle quotes correctly", () => {
        inmapClass.operation(StringOperations.concat, "key1", 'He said "Hello"');
        inmapClass.operation(StringOperations.concat, "key1", " and she said 'Hi'");
        expect(inmapClass.getInMap().get("key1")).toBe('He said "Hello" and she said \'Hi\'');
      });
    });

    describe("Building complex strings", () => {
      it("should build URLs", () => {
        inmapClass.operation(StringOperations.concat, "url", "https://");
        inmapClass.operation(StringOperations.concat, "url", "example.com");
        inmapClass.operation(StringOperations.concat, "url", "/api/v1");
        inmapClass.operation(StringOperations.concat, "url", "/users");
        inmapClass.operation(StringOperations.concat, "url", "?page=1");
        inmapClass.operation(StringOperations.concat, "url", "&limit=10");
        expect(inmapClass.getInMap().get("url")).toBe("https://example.com/api/v1/users?page=1&limit=10");
      });

      it("should build JSON strings", () => {
        inmapClass.operation(StringOperations.concat, "json", '{"name":"');
        inmapClass.operation(StringOperations.concat, "json", "John Doe");
        inmapClass.operation(StringOperations.concat, "json", '","age":');
        inmapClass.operation(StringOperations.concat, "json", "30");
        inmapClass.operation(StringOperations.concat, "json", "}");
        expect(inmapClass.getInMap().get("json")).toBe('{"name":"John Doe","age":30}');
      });

      it("should build HTML content", () => {
        inmapClass.operation(StringOperations.concat, "html", "<div>");
        inmapClass.operation(StringOperations.concat, "html", "<h1>Title</h1>");
        inmapClass.operation(StringOperations.concat, "html", "<p>Content</p>");
        inmapClass.operation(StringOperations.concat, "html", "</div>");
        expect(inmapClass.getInMap().get("html")).toBe("<div><h1>Title</h1><p>Content</p></div>");
      });

      it("should build SQL queries", () => {
        inmapClass.operation(StringOperations.concat, "sql", "SELECT * FROM users");
        inmapClass.operation(StringOperations.concat, "sql", " WHERE age > 18");
        inmapClass.operation(StringOperations.concat, "sql", " AND status = 'active'");
        inmapClass.operation(StringOperations.concat, "sql", " ORDER BY created_at DESC");
        inmapClass.operation(StringOperations.concat, "sql", " LIMIT 10");
        expect(inmapClass.getInMap().get("sql")).toBe(
          "SELECT * FROM users WHERE age > 18 AND status = 'active' ORDER BY created_at DESC LIMIT 10"
        );
      });
    });

    describe("Multiple keys", () => {
      it("should handle operations on different keys independently", () => {
        inmapClass.operation(StringOperations.concat, "key1", "Value 1");
        inmapClass.operation(StringOperations.concat, "key2", "Value 2");
        inmapClass.operation(StringOperations.concat, "key3", "Value 3");

        expect(inmapClass.getInMap().get("key1")).toBe("Value 1");
        expect(inmapClass.getInMap().get("key2")).toBe("Value 2");
        expect(inmapClass.getInMap().get("key3")).toBe("Value 3");
        expect(inmapClass.getInMap().size).toBe(3);
      });

      it("should maintain separate values when concatenating to different keys", () => {
        inmapClass.operation(StringOperations.concat, "greeting", "Hello");
        inmapClass.operation(StringOperations.concat, "farewell", "Goodbye");

        inmapClass.operation(StringOperations.concat, "greeting", " World");
        inmapClass.operation(StringOperations.concat, "farewell", " Friend");

        expect(inmapClass.getInMap().get("greeting")).toBe("Hello World");
        expect(inmapClass.getInMap().get("farewell")).toBe("Goodbye Friend");
      });
    });

    describe("Edge cases", () => {
      it("should handle very long strings", () => {
        const longString = "a".repeat(10000);
        inmapClass.operation(StringOperations.concat, "key1", longString);
        expect(inmapClass.getInMap().get("key1")).toBe(longString);

        inmapClass.operation(StringOperations.concat, "key1", longString);
        expect(inmapClass.getInMap().get("key1")).toBe(longString + longString);
        expect(inmapClass.getInMap().get("key1")?.length).toBe(20000);
      });

      it("should handle strings with only whitespace", () => {
        inmapClass.operation(StringOperations.concat, "key1", "   ");
        expect(inmapClass.getInMap().get("key1")).toBe("   ");

        inmapClass.operation(StringOperations.concat, "key1", "\t\t");
        expect(inmapClass.getInMap().get("key1")).toBe("   \t\t");

        inmapClass.operation(StringOperations.concat, "key1", "\n\n");
        expect(inmapClass.getInMap().get("key1")).toBe("   \t\t\n\n");
      });

      it("should handle null bytes and special control characters", () => {
        inmapClass.operation(StringOperations.concat, "key1", "before\0after");
        expect(inmapClass.getInMap().get("key1")).toBe("before\0after");
      });

      it("should handle repeated concatenations", () => {
        for (let i = 1; i <= 100; i++) {
          inmapClass.operation(StringOperations.concat, "key1", i.toString());
          if (i < 100) {
            inmapClass.operation(StringOperations.concat, "key1", ",");
          }
        }
        const result = inmapClass.getInMap().get("key1");
        expect(result).toContain("1,2,3");
        expect(result).toContain("98,99,100");
      });
    });

    describe("Pattern building", () => {
      it("should build CSV lines", () => {
        const headers = ["Name", "Age", "City"];
        const data = ["John Doe", "30", "New York"];

        // Build header line
        headers.forEach((header, index) => {
          inmapClass.operation(StringOperations.concat, "csv", header);
          if (index < headers.length - 1) {
            inmapClass.operation(StringOperations.concat, "csv", ",");
          }
        });
        inmapClass.operation(StringOperations.concat, "csv", "\n");

        // Build data line
        data.forEach((value, index) => {
          inmapClass.operation(StringOperations.concat, "csv", value);
          if (index < data.length - 1) {
            inmapClass.operation(StringOperations.concat, "csv", ",");
          }
        });

        expect(inmapClass.getInMap().get("csv")).toBe("Name,Age,City\nJohn Doe,30,New York");
      });

      it("should build markdown content", () => {
        inmapClass.operation(StringOperations.concat, "md", "# Title\n\n");
        inmapClass.operation(StringOperations.concat, "md", "## Subtitle\n\n");
        inmapClass.operation(StringOperations.concat, "md", "This is a paragraph with **bold** ");
        inmapClass.operation(StringOperations.concat, "md", "and *italic* text.\n\n");
        inmapClass.operation(StringOperations.concat, "md", "- Item 1\n");
        inmapClass.operation(StringOperations.concat, "md", "- Item 2\n");
        inmapClass.operation(StringOperations.concat, "md", "- Item 3");

        const expected = "# Title\n\n## Subtitle\n\nThis is a paragraph with **bold** and *italic* text.\n\n- Item 1\n- Item 2\n- Item 3";
        expect(inmapClass.getInMap().get("md")).toBe(expected);
      });
    });
  });

  describe("StringOperations.replace", () => {
    it("should handle replace operations", () => {
      // Note: The current implementation has a signature mismatch
      // operationReplace expects (key, expression, value) but operation() only passes (key, value)
      // This test documents the current behavior

      const replaceSpy = vi.spyOn(inmapClass as any, "operationReplace");

      inmapClass.operation(StringOperations.replace, "key1", "replacement");

      // The method is called but with incorrect parameters
      expect(replaceSpy).toHaveBeenCalledWith("key1", "replacement");

      // Due to the implementation issue, the actual behavior may not work as expected
      // The function expects (key, expression, value) but gets (key, value)
    });
  });

  describe("Performance considerations", () => {
    it("should handle large number of small concatenations efficiently", () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        inmapClass.operation(StringOperations.concat, "perf", "x");
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(inmapClass.getInMap().get("perf")).toBe("x".repeat(1000));
      // Should complete in reasonable time (less than 100ms for 1000 operations)
      expect(duration).toBeLessThan(100);
    });
  });

  describe("String operation combinations", () => {
    it("should build complex templates", () => {
      // Build a template string
      inmapClass.operation(StringOperations.concat, "template", "Dear {{name}},\n\n");
      inmapClass.operation(StringOperations.concat, "template", "Thank you for your order #{{orderId}}.\n");
      inmapClass.operation(StringOperations.concat, "template", "Your items will be delivered on {{date}}.\n\n");
      inmapClass.operation(StringOperations.concat, "template", "Best regards,\n");
      inmapClass.operation(StringOperations.concat, "template", "{{company}}");

      const template = inmapClass.getInMap().get("template");
      expect(template).toContain("{{name}}");
      expect(template).toContain("{{orderId}}");
      expect(template).toContain("{{date}}");
      expect(template).toContain("{{company}}");
    });

    it("should build log messages", () => {
      const timestamp = new Date().toISOString();

      inmapClass.operation(StringOperations.concat, "log", `[${timestamp}] `);
      inmapClass.operation(StringOperations.concat, "log", "[INFO] ");
      inmapClass.operation(StringOperations.concat, "log", "User ");
      inmapClass.operation(StringOperations.concat, "log", "john.doe");
      inmapClass.operation(StringOperations.concat, "log", " logged in from ");
      inmapClass.operation(StringOperations.concat, "log", "192.168.1.1");

      const logMessage = inmapClass.getInMap().get("log");
      expect(logMessage).toContain("[INFO]");
      expect(logMessage).toContain("john.doe");
      expect(logMessage).toContain("192.168.1.1");
    });
  });

  describe("Return values", () => {
    it("should return the Map after each concat operation", () => {
      const concatSpy = vi.spyOn(inmapClass as any, "operationConcat");

      inmapClass.operation(StringOperations.concat, "key", "test");

      expect(concatSpy).toHaveReturnedWith(inmapClass.getInMap());
      expect(inmapClass.getInMap()).toBeInstanceOf(Map);
      expect(inmapClass.getInMap().get("key")).toBe("test");
    });
  });
});
