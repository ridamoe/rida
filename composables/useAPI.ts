export const useAPI = () => {
  const { $api } = useNuxtApp();

  async function getSeries(
    remote: RemoteProviderSpec
  ): Promise<APISeriesResponse> {
    return $api(`/website/${remote.key}/series`, {
      query: remote.params,
    });
  }

  async function getImages(
    remote: RemoteProviderSpec,
    params: Record<string, string>
  ): Promise<APIImagesResponse> {
    return $api(`/website/${remote.key}/images`, {
      query: { ...remote.params, ...params },
    });
  }

  return {
    getSeries,
    getImages,
  };
};
