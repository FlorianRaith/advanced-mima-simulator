<template>
    <div>
        <SimulatorCanvas />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import SimulatorCanvas from '@/components/SimulatorCanvas.vue';

@Options({
    components: {
        SimulatorCanvas,
    },
})
export default class Home extends Vue {}
</script>
