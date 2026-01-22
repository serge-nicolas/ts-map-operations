import { dump } from "../decorators/dump";
import { call } from "../decorators/call";

export enum NumberOperations {
  add = "add",
  multiply = "multiply",
  divide = "divide",
  subtract = "subtract",
}
export enum StringOperations {
  concat = "concat",
  replace = "replace",
}

export enum mapOperations {
  merge = "union",
  intersect = "intersection",
  difference = "difference",
  mergeAndSum = "mergeAndSum",
}

export class InmapClass {
  private inMap: Map<string, any>;

  constructor() {
    this.inMap = new Map<string, any>();
    console.log("InmapClass created");
  }

  @call("action")
  public searchByKey(key: RegExp): Map<string, any> {
    const resultMap = new Map<string, any>();
    const keys = Array.from(this.inMap.keys()).filter((k) => key.test(k));
    keys.forEach((k) => resultMap.set(k, this.inMap.get(k)));
    return resultMap;
  }

  @call("operation")
  public operation(
    operation: NumberOperations | StringOperations | mapOperations,
    key: string,
    value: number | string | Map<string, any>,
  ): void {
    switch (operation) {
      case NumberOperations.add:
        this.operationAdd(key, value as number);
        break;
      case NumberOperations.multiply:
        this.operationMultiply(key, value as number);
        break;
      case NumberOperations.divide:
        this.operationDivide(key, value as number);
        break;
      case NumberOperations.subtract:
        this.operationSubtract(key, value as number);
        break;
      case StringOperations.concat:
        this.operationConcat(key, value as string);
        break;
      case StringOperations.replace:
        this.operationReplace(key, value as string);
        break;
      case mapOperations.merge:
        this.operationMerge(key, value as Map<string, any>);
        break;
      case mapOperations.intersect:
        this.operationIntersect(key, value as Map<string, any>);
        break;
      case mapOperations.difference:
        this.operationDifference(key, value as Map<string, any>);
        break;
      case mapOperations.mergeAndSum:
        this.operationMergeAndSum(key, value as Map<string, any>);
        break;
    }
  }

  @call("operationAdd")
  private operationAdd(key: string, value: number): Map<string, any> {
    this.inMap.set(key, (this.inMap.get(key) || 0) + value);
    return this.inMap;
  }

  @call("operationSubtract")
  private operationSubtract(key: string, value: number): Map<string, any> {
    this.inMap.set(key, (this.inMap.get(key) || 0) - value);
    return this.inMap;
  }

  @call("operationMultiply")
  private operationMultiply(key: string, value: number): Map<string, any> {
    this.inMap.set(
      key,
      (this.inMap.has(key) ? this.inMap.get(key) : 1) * value,
    );
    return this.inMap;
  }

  @call("operationDivide")
  private operationDivide(key: string, value: number): Map<string, any> {
    this.inMap.set(
      key,
      (this.inMap.has(key) ? this.inMap.get(key) : 1) / value,
    );
    return this.inMap;
  }

  @call("operationConcat")
  private operationConcat(key: string, value: string): Map<string, any> {
    this.inMap.set(key, (this.inMap.get(key) || "") + value);
    return this.inMap;
  }

  @call("operationReplace")
  private operationReplace(
    key: string,
    expression: string,
    value: string,
  ): Map<string, any> {
    this.inMap.set(key, (this.inMap.get(key) || "").replace(expression, value));
    return this.inMap;
  }

  @call("operationMerge")
  private operationMerge(
    key: string,
    value: Map<string, any>,
  ): Map<string, any> {
    // Get existing map at key or create new one
    const existingMap = this.inMap.get(key) || new Map<string, any>();

    // Ensure existing value is a Map
    if (!(existingMap instanceof Map)) {
      throw new TypeError(`Value at key '${key}' is not a Map`);
    }

    // Create a new Map with the union of both maps
    const mergedMap = new Map<string, any>(existingMap);

    // Add all entries from the value map (overwrites duplicates)
    for (const [k, v] of value) {
      mergedMap.set(k, v);
    }

    this.inMap.set(key, mergedMap);
    return this.inMap;
  }

  @call("operationIntersect")
  private operationIntersect(
    key: string,
    value: Map<string, any>,
  ): Map<string, any> {
    // Get existing map at key or create new one
    const existingMap = this.inMap.get(key) || new Map<string, any>();

    // Ensure existing value is a Map
    if (!(existingMap instanceof Map)) {
      throw new TypeError(`Value at key '${key}' is not a Map`);
    }

    // Create a new Map with only the keys that exist in both maps
    const intersectedMap = new Map<string, any>();

    for (const [k, v] of existingMap) {
      if (value.has(k)) {
        // Keep the value from the existing map
        intersectedMap.set(k, v);
      }
    }

    this.inMap.set(key, intersectedMap);
    return this.inMap;
  }

  @call("operationDifference")
  private operationDifference(
    key: string,
    value: Map<string, any>,
  ): Map<string, any> {
    // Get existing map at key or create new one
    const existingMap = this.inMap.get(key) || new Map<string, any>();

    // Ensure existing value is a Map
    if (!(existingMap instanceof Map)) {
      throw new TypeError(`Value at key '${key}' is not a Map`);
    }

    // Create a new Map with keys from existing that are not in value map
    const differenceMap = new Map<string, any>();

    for (const [k, v] of existingMap) {
      if (!value.has(k)) {
        differenceMap.set(k, v);
      }
    }

    this.inMap.set(key, differenceMap);
    return this.inMap;
  }

  @call("operationMergeAndSum")
  private operationMergeAndSum(
    key: string,
    value: Map<string, any>,
  ): Map<string, any> {
    // Get existing map at key or create new one
    const existingMap = this.inMap.get(key) || new Map<string, any>();

    // Ensure existing value is a Map
    if (!(existingMap instanceof Map)) {
      throw new TypeError(`Value at key '${key}' is not a Map`);
    }

    // Create a new Map with the merged values
    const mergedMap = new Map<string, any>(existingMap);

    // Add all entries from the value map
    for (const [k, v] of value) {
      if (mergedMap.has(k)) {
        const existingValue = mergedMap.get(k);
        // If both values are numbers, sum them
        if (typeof existingValue === "number" && typeof v === "number") {
          mergedMap.set(k, existingValue + v);
        } else {
          // Otherwise, overwrite with new value
          mergedMap.set(k, v);
        }
      } else {
        // Key doesn't exist, just add it
        mergedMap.set(k, v);
      }
    }

    this.inMap.set(key, mergedMap);
    return this.inMap;
  }

  public getInMap(): Map<string, any> {
    return this.inMap;
  }
}
