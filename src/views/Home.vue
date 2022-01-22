<template>
  <div>
    <Simulator />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Simulator from '@/components/simulator/Simulator.vue';

@Options({
  components: {
    Simulator,
  },
})
export default class Home extends Vue {}
</script>
