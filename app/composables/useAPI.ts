function _filter(raw: any, allowed: string[]) {
  return Object.keys(raw)
    .filter((key) => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = raw[key];
      return obj;
    }, {} as any);
}
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
    let keyInfo = (await getInfo()).result[remote.key];
    if (!keyInfo) throw new Error("Failed to get remote key info");
    let allowed_params = keyInfo.params;
    let p = _filter({ ...remote.params, ...params }, allowed_params.images);
    return $api(`/website/${remote.key}/images`, {
      query: p,
    });
  }

  async function getInfo(): Promise<APIInfo> {
    return $api(`/info`);
  }

  async function getMatch(url: string): Promise<APIMatchResponse> {
    return $api(`/match`, {
      query: { url },
    });
  }

  return {
    getSeries,
    getImages,
    getMatch,
    getInfo,
  };
};
