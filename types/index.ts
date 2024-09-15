declare global {
  interface Source {
    name: string;
    images: string[];
  }

  interface Chapter extends APIChapter {
    provider_key: string;
    value: number;
    sources?: Source[];
  }

  interface APIChapter {
    chapter: string;
    params?: Record<string, string>;
    language?: string;
    title?: string;
    sources?: APISource[];
    volume?: string | number;
  }

  interface APISource {
    name: string;
    base?: string;
    images: string[];
  }

  interface LocalProviderSpec {
    type: "local";
    key: string;
    series: APISeries;
  }

  interface RemoteProviderSpec {
    type: "remote";
    key: string;
    params: Record<string, string>;
    chapters?: APIChapter | APIChapter[];
  }

  type ProviderSpec = RemoteProviderSpec | LocalProviderSpec;

  interface ConfigDataSpec {
    providers: ProviderSpec[];
  }

  interface APIResponse {
    error?: string;
    result: null | any;
  }

  interface Series {
    title?: string;
    cover?: string;
    chapters: Chapter[];
  }

  interface APISeries {
    title?: string;
    cover?: string;
    chapters?: APIChapter[];
  }

  interface APISeriesResponse {
    result: APISeries | null;
  }

  interface APIImagesResponse {
    result: APISource[];
  }
}

export {};
