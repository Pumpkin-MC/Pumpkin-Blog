<template>
  <span class="not-prose my-6 mx-auto max-w-3xl w-full flex flex-col items-center justify-center">
    <span class="mx-auto max-w-3xl w-full flex justify-center items-center overflow-hidden rounded-xl border border-black/10 dark:border-white/10 shadow-lg bg-black/5 dark:bg-white/5">
      <component
        :is="ImageComponent"
        :src="refinedSrc"
        :alt="props.alt"
        :width="props.width"
        :height="props.height"
        class="mx-auto block max-w-full h-auto rounded-xl"
      />
    </span>
    <span v-if="props.alt" class="text-center text-sm text-foreground/70 mt-2 block">
      {{ props.alt }}
    </span>
  </span>
</template>

<script setup>
import { withTrailingSlash, withLeadingSlash, joinURL } from "ufo";
import { useRuntimeConfig, computed } from "#imports";
import ImageComponent from "#build/mdc-image-component.mjs";

const props = defineProps({
  src: {
    type: String,
    default: ""
  },
  alt: {
    type: String,
    default: ""
  },
  width: {
    type: [String, Number],
    default: void 0
  },
  height: {
    type: [String, Number],
    default: void 0
  }
});

const refinedSrc = computed(() => {
  if (props.src?.startsWith("/") && !props.src.startsWith("//")) {
    const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL));
    if (_base !== "/" && !props.src.startsWith(_base)) {
      return joinURL(_base, props.src);
    }
  }
  return props.src;
});
</script>
