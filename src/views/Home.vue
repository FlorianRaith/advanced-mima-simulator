<template>
    <div>
        <Simulator />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import SimulatorComponent from '@/simulator/render/SimulatorComponent.vue';

@Options({
    components: {
        Simulator: SimulatorComponent,
    },
})
export default class Home extends Vue {}
</script>
