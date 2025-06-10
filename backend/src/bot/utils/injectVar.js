export const injectTemplate = (template, variables) => {
  return template.replace(/\{(\w+)\}/g, (_, key) => variables[key] ?? `{${key}}`);
}