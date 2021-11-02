interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_JWT_SECRET: string
  readonly VITE_: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
