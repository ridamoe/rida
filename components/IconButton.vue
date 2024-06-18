<script setup lang="ts">
defineProps<{
  icon: string;
  iconClass?: string;
  disableAnimation?: boolean;
}>();

defineEmits(["click"]);
</script>

<template>
  <button
    @click="$emit('click')"
    class="group relative aspect-square h-full cursor-default text-stone-200 hover:text-rose-700"
  >
    <Icon
      :icon="icon"
      class="relative transition-[bottom] ease-in"
      :class="[{ 'group-hover:bottom-[3px]': !disableAnimation }, iconClass]"
    />
  </button>
</template>
