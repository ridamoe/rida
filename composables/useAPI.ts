export const useAPI = () => {
  const { $api } = useNuxtApp();

  async function getSeries(
    remote: RemoteProviderSpec
  ): Promise<APISeriesResponse> {
    return $api(`/website/${remote.key}/series`, {
      query: remote.params,
    });
  }

  async function getChapterPages(
    remote: RemoteProviderSpec,
    chapter: string | null
  ): Promise<APIChapterPagesResponse> {
    return $api(`/website/${remote.key}/chapter/pages`, {
      query: { ...remote.params, chapter },
    });
  }

  return {
    getSeries,
    getChapterPages,
  };
};
