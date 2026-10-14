export interface CodeLanguage {
  name: string;
  id: string;
}

export const codeLanguages: CodeLanguage[] = [
  { name: "javascript", id: "javascript" },
  { name: "js", id: "javascript" },
  { name: "typescript", id: "typescript" },
  { name: "ts", id: "typescript" },
  { name: "jsx", id: "jsx" },
  { name: "tsx", id: "tsx" },
  { name: "python", id: "python" },
  { name: "py", id: "python" },
  { name: "java", id: "java" },
  { name: "c", id: "c" },
  { name: "cpp", id: "cpp" },
  { name: "csharp", id: "csharp" },
  { name: "cs", id: "csharp" },
  { name: "go", id: "go" },
  { name: "rust", id: "rust" },
  { name: "php", id: "php" },
  { name: "ruby", id: "ruby" },
  { name: "rb", id: "ruby" },
  { name: "kotlin", id: "kotlin" },
  { name: "swift", id: "swift" },
  { name: "bash", id: "bash" },
  { name: "sh", id: "bash" },
  { name: "html", id: "markup" },
  { name: "xml", id: "markup" },
  { name: "css", id: "css" },
  { name: "scss", id: "scss" },
  { name: "json", id: "json" },
  { name: "yaml", id: "yaml" },
  { name: "yml", id: "yaml" },
  { name: "sql", id: "sql" },
  { name: "graphql", id: "graphql" },
  { name: "markdown", id: "markdown" },
  { name: "md", id: "markdown" },
  { name: "diff", id: "diff" },
  { name: "dockerfile", id: "docker" },
];

export const findCodeLanguage = (name: string) =>
  codeLanguages.find((language) => language.name === name.toLowerCase());
