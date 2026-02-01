"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.call = void 0;
const call = (name) => (_, propertyKey, descriptor) => {
    // Store the original method
    const originalMethod = descriptor.value;
    // Replace the method with our wrapper
    descriptor.value = function (...args) {
        console.log(`[CALL] ${name}.${propertyKey} : ${JSON.stringify(args)}`);
        // Run the original logic passed into the decorator
        const result = originalMethod.apply(this, args);
        // Handle both sync and async results
        if (result && typeof result.then === "function") {
            // If it's a promise, return it as is
            return result;
        }
        else {
            // If it's not a promise, return the value directly
            return result;
        }
    };
    return descriptor;
};
exports.call = call;
