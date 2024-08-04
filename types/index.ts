declare global {
  interface LocalSpec {
    name: string;
    base?: string;
    pages: string[];
  }

  interface RemoteSpec {
    website: string;
    params: string[] | Record<string, string>;
  }

  interface ConfigDataSpec {
    remotes?: {
      [chapter: string]: RemoteSpec[];
    };
    locals?: {
      [chapter: string]: LocalSpec[];
    };
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
    result: LocalSpec | null;
  }
}

export {};
