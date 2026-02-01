"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InmapClass = exports.mapOperations = exports.StringOperations = exports.NumberOperations = void 0;
const call_1 = require("../decorators/call");
var NumberOperations;
(function (NumberOperations) {
    NumberOperations["add"] = "add";
    NumberOperations["multiply"] = "multiply";
    NumberOperations["divide"] = "divide";
    NumberOperations["subtract"] = "subtract";
})(NumberOperations || (exports.NumberOperations = NumberOperations = {}));
var StringOperations;
(function (StringOperations) {
    StringOperations["concat"] = "concat";
    StringOperations["replace"] = "replace";
})(StringOperations || (exports.StringOperations = StringOperations = {}));
var mapOperations;
(function (mapOperations) {
    mapOperations["merge"] = "union";
    mapOperations["intersect"] = "intersection";
    mapOperations["difference"] = "difference";
    mapOperations["mergeAndSum"] = "mergeAndSum";
})(mapOperations || (exports.mapOperations = mapOperations = {}));
class InmapClass {
    inMap;
    constructor() {
        this.inMap = new Map();
        console.log("InmapClass created");
    }
    searchByKey(key) {
        const resultMap = new Map();
        const keys = Array.from(this.inMap.keys()).filter((k) => key.test(k));
        keys.forEach((k) => resultMap.set(k, this.inMap.get(k)));
        return resultMap;
    }
    operation(operation, key, value) {
        switch (operation) {
            case NumberOperations.add:
                this.operationAdd(key, value);
                break;
            case NumberOperations.multiply:
                this.operationMultiply(key, value);
                break;
            case NumberOperations.divide:
                this.operationDivide(key, value);
                break;
            case NumberOperations.subtract:
                this.operationSubtract(key, value);
                break;
            case StringOperations.concat:
                this.operationConcat(key, value);
                break;
            case StringOperations.replace:
                this.operationReplace(key, "", value);
                break;
            case mapOperations.merge:
                this.operationMerge(key, value);
                break;
            case mapOperations.intersect:
                this.operationIntersect(key, value);
                break;
            case mapOperations.difference:
                this.operationDifference(key, value);
                break;
            case mapOperations.mergeAndSum:
                this.operationMergeAndSum(key, value);
                break;
        }
    }
    operationAdd(key, value) {
        this.inMap.set(key, (this.inMap.get(key) || 0) + value);
        return this.inMap;
    }
    operationSubtract(key, value) {
        this.inMap.set(key, (this.inMap.get(key) || 0) - value);
        return this.inMap;
    }
    operationMultiply(key, value) {
        this.inMap.set(key, (this.inMap.has(key) ? this.inMap.get(key) : 1) * value);
        return this.inMap;
    }
    operationDivide(key, value) {
        this.inMap.set(key, (this.inMap.has(key) ? this.inMap.get(key) : 1) / value);
        return this.inMap;
    }
    operationConcat(key, value) {
        this.inMap.set(key, (this.inMap.get(key) || "") + value);
        return this.inMap;
    }
    operationReplace(key, expression, value) {
        this.inMap.set(key, (this.inMap.get(key) || "").replace(expression, value));
        return this.inMap;
    }
    operationMerge(key, value) {
        // Get existing map at key or create new one
        const existingMap = this.inMap.get(key) || new Map();
        // Ensure existing value is a Map
        if (!(existingMap instanceof Map)) {
            throw new TypeError(`Value at key '${key}' is not a Map`);
        }
        // Create a new Map with the union of both maps
        const mergedMap = new Map(existingMap);
        // Add all entries from the value map (overwrites duplicates)
        for (const [k, v] of value) {
            mergedMap.set(k, v);
        }
        this.inMap.set(key, mergedMap);
        return this.inMap;
    }
    operationIntersect(key, value) {
        // Get existing map at key or create new one
        const existingMap = this.inMap.get(key) || new Map();
        // Ensure existing value is a Map
        if (!(existingMap instanceof Map)) {
            throw new TypeError(`Value at key '${key}' is not a Map`);
        }
        // Create a new Map with only the keys that exist in both maps
        const intersectedMap = new Map();
        for (const [k, v] of existingMap) {
            if (value.has(k)) {
                // Keep the value from the existing map
                intersectedMap.set(k, v);
            }
        }
        this.inMap.set(key, intersectedMap);
        return this.inMap;
    }
    operationDifference(key, value) {
        // Get existing map at key or create new one
        const existingMap = this.inMap.get(key) || new Map();
        // Ensure existing value is a Map
        if (!(existingMap instanceof Map)) {
            throw new TypeError(`Value at key '${key}' is not a Map`);
        }
        // Create a new Map with keys from existing that are not in value map
        const differenceMap = new Map();
        for (const [k, v] of existingMap) {
            if (!value.has(k)) {
                differenceMap.set(k, v);
            }
        }
        this.inMap.set(key, differenceMap);
        return this.inMap;
    }
    operationMergeAndSum(key, value) {
        // Get existing map at key or create new one
        const existingMap = this.inMap.get(key) || new Map();
        // Ensure existing value is a Map
        if (!(existingMap instanceof Map)) {
            throw new TypeError(`Value at key '${key}' is not a Map`);
        }
        // Create a new Map with the merged values
        const mergedMap = new Map(existingMap);
        // Add all entries from the value map
        for (const [k, v] of value) {
            if (mergedMap.has(k)) {
                const existingValue = mergedMap.get(k);
                // If both values are numbers, sum them
                if (typeof existingValue === "number" && typeof v === "number") {
                    mergedMap.set(k, existingValue + v);
                }
                else {
                    // Otherwise, overwrite with new value
                    mergedMap.set(k, v);
                }
            }
            else {
                // Key doesn't exist, just add it
                mergedMap.set(k, v);
            }
        }
        this.inMap.set(key, mergedMap);
        return this.inMap;
    }
    set(key, value) {
        this.inMap.set(key, value);
        return this.inMap;
    }
    getInMap() {
        return this.inMap;
    }
}
exports.InmapClass = InmapClass;
__decorate([
    (0, call_1.call)("action"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegExp]),
    __metadata("design:returntype", Map)
], InmapClass.prototype, "searchByKey", null);
__decorate([
    (0, call_1.call)("operation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], InmapClass.prototype, "operation", null);
__decorate([
    (0, call_1.call)("operationAdd"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Map)
], InmapClass.prototype, "operationAdd", null);
__decorate([
    (0, call_1.call)("operationSubtract"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Map)
], InmapClass.prototype, "operationSubtract", null);
__decorate([
    (0, call_1.call)("operationMultiply"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Map)
], InmapClass.prototype, "operationMultiply", null);
__decorate([
    (0, call_1.call)("operationDivide"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Map)
], InmapClass.prototype, "operationDivide", null);
__decorate([
    (0, call_1.call)("operationConcat"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Map)
], InmapClass.prototype, "operationConcat", null);
__decorate([
    (0, call_1.call)("operationReplace"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Map)
], InmapClass.prototype, "operationReplace", null);
__decorate([
    (0, call_1.call)("operationMerge"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Map]),
    __metadata("design:returntype", Map)
], InmapClass.prototype, "operationMerge", null);
__decorate([
    (0, call_1.call)("operationIntersect"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Map]),
    __metadata("design:returntype", Map)
], InmapClass.prototype, "operationIntersect", null);
__decorate([
    (0, call_1.call)("operationDifference"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Map]),
    __metadata("design:returntype", Map)
], InmapClass.prototype, "operationDifference", null);
__decorate([
    (0, call_1.call)("operationMergeAndSum"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Map]),
    __metadata("design:returntype", Map)
], InmapClass.prototype, "operationMergeAndSum", null);
