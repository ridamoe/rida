<template>
  <div
    class="max-w-screen flex min-h-screen flex-col items-center justify-center bg-black"
  >
    <div class="flex h-52 items-center justify-center">
      <svg class="h-full w-full" viewBox="0 0 312 130">
        <use class="text-gray-800" xlink:href="/text_icon.svg#background"></use>
        <use
          class="text-rose-600"
          xlink:href="/text_icon.svg#accent_logo"
        ></use>
      </svg>
    </div>
    <div class="w-[50%] p-5">
      <input
        type="text"
        name="url"
        class="block w-full rounded-md border-0 bg-gray-800 py-2 ps-5 text-lg text-gray-300 outline-none ring-1 ring-inset ring-slate-500 placeholder:text-gray-500 hover:ring-1 focus:ring-2 focus:ring-inset focus:ring-rose-600"
        placeholder="Insert a source or a spec url"
      />
    </div>
  </div>
</template>
