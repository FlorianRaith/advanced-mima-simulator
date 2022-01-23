<template>
    <div>
        <Canvas :controller="controller" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Canvas from '@/engine/Canvas.vue';
import DebugController from '@/debug/DebugController';

@Options({
    components: {
        Canvas,
    },
})
export default class DebugCanvas extends Vue {
    private controller: DebugController = new DebugController();
}
</script>
