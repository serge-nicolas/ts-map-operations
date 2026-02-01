export const call =
  (name: string) =>
  (_: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Store the original method
    const originalMethod = descriptor.value;

    // Replace the method with our wrapper
    descriptor.value = function (...args: any[]) {
      console.log(`[CALL] ${name}.${propertyKey} : ${JSON.stringify(args)}`);

      // Run the original logic passed into the decorator
      const result = originalMethod.apply(this, args);

      // Handle both sync and async results
      if (result && typeof result.then === "function") {
        // If it's a promise, return it as is
        return result;
      } else {
        // If it's not a promise, return the value directly
        return result;
      }
    };

    return descriptor;
  };
