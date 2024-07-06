declare global {
  interface LocalSpec {
    name: string;
    base?: string;
    pages: string[];
  }

  interface RemoteSpec {
    website: string;
    params: string[];
    chapters?: string[];
  }

  interface ConfigDataSpec {
    remotes?: RemoteSpec[];
    locals?: {
      [key: string]: LocalSpec[];
    };
  }

  interface APIResponse {
    error?: string;
    result: null | any;
  }

  interface APISeriesResponse {
    result: { chapters?: string[] } | null;
  }

  interface APIChapterPagesResponse {
    result: LocalSpec | null;
  }
}

export {};
