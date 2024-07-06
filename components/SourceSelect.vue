<script setup lang="ts">
withDefaults(
  defineProps<{
    selected?: boolean;
    disabled: boolean;
  }>(),
  { selected: false }
);

defineEmits(["click"]);
</script>

<template>
  <p
    class="w-full p-2.5 text-center"
    @click="
      (e) => {
        if (!disabled) $emit('click', e);
      }
    "
    :class="[
      { 'bg-neutral-900': selected && !disabled },
      { 'cursor-not-allowed bg-stone-600 text-stone-400': disabled },
      { 'hover:bg-neutral-700': !selected && !disabled },
    ]"
  >
    <slot></slot>
  </p>
</template>
