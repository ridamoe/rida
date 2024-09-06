<template>
  <div
    class="max-w-screen bg-gradient-radial flex min-h-screen flex-col items-center justify-center from-neutral-50 from-[-700%] to-neutral-950 to-70%"
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
    <div class="flex w-full p-5 md:max-w-[80%] lg:max-w-[60%] lg:px-10">
      <input
        type="text"
        name="url"
        class="block w-full rounded-md border-0 bg-transparent py-2 ps-5 text-lg text-gray-300 outline-none ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 hover:ring-1 focus:ring-2 focus:ring-inset focus:ring-rose-600"
        placeholder="Insert a source or a spec url"
      />
    </div>
  </div>
</template>
