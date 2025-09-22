<script setup lang="ts">
const settings = useSettingsStore();
const progress = useProgressStore();

// Recalc current page when scrolling
function onScroll(e: Event) {
  // Initialize variables
  let currentScore = 0;
  let currentPage = undefined;

  // Get target from event and save root bounds
  let target = e.target as Element;
  let rootBounds = target.getBoundingClientRect();

  target.querySelectorAll("[data-idx]").forEach((element) => {
    // Parse page index from dataset
    let idx = (element as HTMLElement).dataset["idx"]!;
    let page = parseInt(idx) + 1; // Pages start from 1

    let elementBounds = element.getBoundingClientRect();

    // Find visible height of current element inside root
    let bottom = Math.min(elementBounds.bottom, rootBounds.bottom);
    let top = Math.max(elementBounds.top, rootBounds.top);
    let visibleHeight = bottom - top;

    // Calculate score and eventually save page
    let score = visibleHeight / elementBounds.height;
    if (score > currentScore) {
      currentScore = score;
      currentPage = page;
    }
  });

  // Update page if a currentPage is found
  if (currentPage != undefined) progress.setPage(currentPage);
}
</script>

<template>
  <div
    class="scrollbar-hidden h-screen w-full overflow-y-auto"
    @scroll="onScroll"
  >
    <Page
      v-for="(image, idx) in progress.source?.images"
      :data-idx="idx"
      :src="image"
      :loaded="true"
      :page-fit="settings.pageFit"
    />
  </div>
</template>
