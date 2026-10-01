/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Web3Forms access key (public by design). Quote emails go to the address it was created with. */
  readonly VITE_WEB3FORMS_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
