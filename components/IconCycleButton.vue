<script setup lang="ts">
interface IconProps {
  name: string;
  icon: string;
}

const currentStateName = defineModel<string | number>();

const props = defineProps<{
  states: Array<IconProps>;
  disableAnimation?: boolean;
}>();

defineEmits<{
  click: [next: string];
}>();

function findState(name?: string | number): number {
  if (name == undefined) return -1;
  else if (typeof name == "number") return name % props.states.length;
  else return props.states.findIndex((e) => e.name == name);
}

const currentStateIndex = computed(() => findState(currentStateName.value));

const state = computed(() => {
  if (currentStateIndex.value != -1) {
    return props.states[currentStateIndex.value];
  } else return { icon: "i-[gg--debug]" } as IconProps;
});

const nextStateName = computed(() => {
  let idx = (currentStateIndex.value + 1) % props.states.length;
  return props.states[idx].name;
});

function update() {
  currentStateName.value = nextStateName.value;
}
</script>

<template>
  <IconButton
    @click="update"
    :disable-animation="disableAnimation"
    :icon="state.icon"
  />
</template>
