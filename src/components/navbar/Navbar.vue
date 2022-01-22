<template>
  <div>
    <nav class="bg-primary-800">
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
          <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div class="text-white font-bold text-lg flex-shrink-0 flex items-center">Advanced Mima Simulator</div>
            <div class="hidden sm:block sm:ml-6">
              <div class="flex space-x-4">
                <NavbarLink to="/">Home</NavbarLink>
                <NavbarLink to="/learn">Learn</NavbarLink>
                <NavbarLink to="/about">About</NavbarLink>
              </div>
            </div>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"></div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import NavbarLink from '@/components/navbar/NavbarLink.vue';
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
    NavbarLink,
  },
})
export default class Navbar extends Vue {}
</script>
