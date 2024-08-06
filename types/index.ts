declare global {
  interface Provider {
    spec: ProviderSpec;
    chapters: Record<string, Source[] | undefined>;
  }

  interface Source {
    name: string;
    chapter: string;
    pages: string[];
  }

  interface SourceSpec {
    name: string;
    chapter: string;
    base?: string;
    pages: string[];
  }

  interface LocalProviderSpec {
    type: "local";
    key: string;
    metadata?: {
      title: string;
    };
    sources: SourceSpec[];
  }

  interface RemoteProviderSpec {
    type: "remote";
    key: string;
    chapter: "_auto" | string | string[];
    params: Record<string, string>;
  }

  type ProviderSpec = RemoteProviderSpec | LocalProviderSpec;

  interface ConfigDataSpec {
    providers: ProviderSpec[];
  }

  interface APIResponse {
    error?: string;
    result: null | any;
  }

  interface APISeriesResponse {
    result: {
      title?: string;
      chapters?: string[];
    } | null;
  }

  interface APIChapterPagesResponse {
    result: SourceSpec[];
  }
}

export {};
