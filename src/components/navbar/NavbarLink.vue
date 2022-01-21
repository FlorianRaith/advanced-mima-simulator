<template>
  <div class="flex items-center">
    <router-link :to="to" v-slot="{ href, navigate, isActive }" custom>
      <a
        :href="href"
        @click="navigate"
        class="px-3 py-2 rounded-md"
        :class="[
          isActive && 'bg-primary-900 text-white',
          !isActive && 'text-primary-300 hover:bg-primary-700 hover:text-white',
        ]"
      >
        <slot></slot>
      </a>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NavbarLink',
  props: {
    to: String,
  },
};
</script>
