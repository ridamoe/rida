<script setup lang="ts">
defineProps<{
  idx: number;
  active: boolean;
  loaded: boolean;
}>();

defineEmits<{
  (e: "click", idx: number): void;
}>();
</script>

<template>
  <div
    @click="$emit('click', idx)"
    class="relative flex h-8 grow items-end hover:bottom-1"
    :class="[
      {
        [tw`bg-gradient-to-t from-white`]: active,
      },
    ]"
  >
    <div
      class="h-[0.3rem] w-full bg-neutral-600"
      :class="[
        {
          [tw`border-t-[0.1rem] border-rose-600`]: loaded,
        },
      ]"
    ></div>
  </div>
</template>
