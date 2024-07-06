<script setup lang="ts">
defineProps<{
  icon: string;
  iconClass?: string;
  disabled?: boolean;
  disableAnimation?: boolean;
}>();

defineEmits(["click"]);
</script>

<template>
  <button
    @click="$emit('click')"
    class="group relative aspect-square h-full cursor-default text-stone-200"
    :class="[
      {
        [tw`disabled text-stone-400`]: disabled,
        [tw`hover:text-rose-700`]: !disabled,
      },
    ]"
  >
    <Icon
      :icon="icon"
      class="relative transition-[bottom] ease-in"
      :class="[
        { 'group-hover:bottom-[3px]': !disableAnimation && !disabled },
        iconClass,
      ]"
    />
  </button>
</template>
