<script setup lang="ts">
let errorMessage = ref<string>();

const API = useAPI();

useHead({
  title: "Rida",
});

const { data: apiInfo } = await useAsyncData("info", () => API.getInfo());

async function send(e: KeyboardEvent) {
  let input = (e.target as HTMLInputElement).value;
  let url;
  try {
    url = new URL(input);
  } catch (error) {
    errorMessage.value = "Your input is not a valid url";
  }
  let match = await API.getMatch(url?.toString()!);
  if (match.result) {
    if (apiInfo.value?.result[match.result.key].chapters.auto) {
      let selected_chapter;
      if (match.result.params["chapter"]) {
        selected_chapter = match.result.params["chapter"];
        delete match.result.params["chapter"];
      }

      let configData: ConfigDataSpec = {
        providers: [
          {
            type: "remote",
            key: match.result.key,
            params: match.result.params,
          },
        ],
      };
      let data = btoa(JSON.stringify(configData));
      let query: { page: number; d: string } = {
        page: 1,
        d: `json:${data}`,
      };

      let path = "/read";
      if (selected_chapter) path += "/" + selected_chapter;
      navigateTo({ path, query }, { replace: false });
    } else {
      errorMessage.value = "Chapters need to be specified(?)";
    }
  } else {
  }
}
</script>

<template>
  <div
    class="flex min-h-screen max-w-screen flex-col items-center justify-center bg-radial from-neutral-50 from-[-700%] to-neutral-950 to-70%"
  >
    <div class="flex h-44 items-center justify-center md:h-52">
      <svg class="h-full w-full" viewBox="0 0 312 130">
        <use class="text-gray-800" xlink:href="/text_icon.svg#background"></use>
        <use
          class="text-rose-600"
          xlink:href="/text_icon.svg#accent_logo"
        ></use>
      </svg>
    </div>
    <div
      class="relative flex w-full flex-col p-5 md:max-w-[80%] lg:max-w-[60%] lg:px-10"
    >
      <input
        @keydown.enter="send"
        @input="
          () => {
            errorMessage = undefined;
          }
        "
        type="text"
        name="url"
        class="block w-full rounded-md border-0 bg-transparent py-2 ps-5 text-lg text-gray-300 ring-1 ring-gray-500 outline-none ring-inset placeholder:text-gray-500 hover:ring-1 focus:ring-2 focus:ring-rose-600 focus:ring-inset"
        placeholder="Insert a source or a spec url"
      />
      <span
        v-if="errorMessage"
        class="absolute bottom-[-1rem] w-full text-center text-lg text-rose-800"
      >
        {{ errorMessage }}
      </span>
    </div>
  </div>
</template>
