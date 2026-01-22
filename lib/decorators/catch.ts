export function catchError(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      const result = await originalMethod.apply(this, args);
      return result;
    } catch (e: any) {
      console.error("[ERROR]", propertyKey, e.message);
    }
  };

  return descriptor;
}
