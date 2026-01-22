export const dump = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    // Run the original logic passed into the decorator
    const result = await Reflect.apply(originalMethod, this, args);
    console.log(
      `[DUMP] Dump ${target.name || JSON.stringify(target)}.${propertyKey} : ${JSON.stringify(result)}`,
    );
    return result;
  };
};
