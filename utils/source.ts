export class Chapter {
  id: string;
  pages: string[] | undefined;
  _spec: LocalSpec | RemoteSpec;

  constructor(
    id: string,
    spec: LocalSpec | RemoteSpec,
    pages: string[] | undefined = undefined
  ) {
    this.id = id;
    this.pages = pages;
    this._spec = spec;
  }

  static asChapterRecord(
    chaptersList: string[] | Chapter[],
    spec: LocalSpec | RemoteSpec
  ) {
    let chapters = {} as Record<string, Chapter>;
    for (let chapterOrId of chaptersList) {
      let chapter: Chapter;
      if (typeof chapterOrId == "string")
        chapter = new Chapter(chapterOrId, spec);
      else chapter = chapterOrId;
      chapters[chapter.id] = chapter;
    }
    return chapters;
  }

  async fetchPages() {
    if (!this.pages) {
      let pageSpec: { base?: string; pages: string[] } | undefined;
      if ("website" in this._spec) {
        const API = useApi();
        let _pages = await API.getChapterPages(this._spec, this.id);
        if (_pages && _pages.result) pageSpec = _pages.result;
      } else {
        pageSpec = this._spec;
      }
      if (pageSpec)
        this.pages = pageSpec.pages.map((page) => (pageSpec.base ?? "") + page);
    }
    return this.pages;
  }
}

export class Source {
  name: string;
  chapters: Record<string, Chapter>;
  _spec: LocalSpec | RemoteSpec;

  constructor(
    name: string,
    chapters: Record<string, Chapter>,
    spec: LocalSpec | RemoteSpec
  ) {
    this.name = name;
    this.chapters = chapters;
    this._spec = spec;
  }
}
