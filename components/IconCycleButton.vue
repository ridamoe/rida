<script lang="ts">
interface State {
  value: string | boolean;
  icon: string;
}

function validateState(states: Array<State>): boolean {
  const values = new Set<string | boolean>();
  for (const item of states) {
    if (values.has(item.value)) {
      return false;
    }
    values.add(item.value);
  }
  return true;
}
</script>

<script setup lang="ts">
const currentValue = defineModel<string | boolean>();

const props = defineProps({
  states: {
    type: Array<State>,
    required: true,
    validator: validateState,
  },
  disableAnimation: {
    type: Boolean,
    required: false,
  },
});

defineEmits<{
  click: [next: string];
}>();

const state = computed(() => {
  let state = { icon: "i-[gg--debug]" } as State;
  if (currentValue.value != undefined) {
    let found = props.states.find((e) => e.value == currentValue.value);
    if (found != undefined) state = found;
  }
  return state;
});

const nextStateName = computed(() => {
  let currentIdx = props.states.indexOf(state.value);
  let idx = (currentIdx + 1) % props.states.length;
  return props.states[idx].value;
});

function update() {
  currentValue.value = nextStateName.value;
}
</script>

<template>
  <IconButton
    @click="update"
    :disable-animation="disableAnimation"
    :icon="state.icon"
  />
</template>
