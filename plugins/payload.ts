import { Source, Chapter } from "../utils/source";

export default definePayloadPlugin(() => {
  definePayloadReducer("Source", (data: Source | any) => {
    if (data instanceof Source) {
      return {
        name: data.name,
        chapters: data.chapters,
        spec: data._spec,
      };
    }
  });
  definePayloadReviver("Source", (data) => {
    return new Source(data.name, data.chapters, data.spec);
  });

  definePayloadReducer("Chapter", (data: Chapter | any) => {
    if (data instanceof Chapter) {
      return {
        id: data.id,
        spec: data._spec,
        pages: data.pages,
      };
    }
  });
  definePayloadReviver("Chapter", (data) => {
    return new Chapter(data.id, data.spec, data.pages);
  });
});
