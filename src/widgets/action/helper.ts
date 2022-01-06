function resolveControlProps(
  props: Record<string, any>,
  options: Record<string, any>,
): Record<string, any> {
  const { className, ...events } = options;
  const resolved: Record<string, any> = { ...props, ...events };

  if (className) {
    resolved.className = className;
  }

  return resolved;
}

export { resolveControlProps };
