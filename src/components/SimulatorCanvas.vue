<template>
    <div>
        <Canvas :controller="controller" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Canvas from '@/engine/Canvas.vue';
import Simulator from '@/simulator/Simulator';

@Options({
    components: {
        Canvas,
    },
})
export default class SimulatorCanvas extends Vue {
    private controller: Simulator = new Simulator();
}
</script>
