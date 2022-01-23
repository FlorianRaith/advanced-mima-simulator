<template>
    <div>
        <DebugCanvas />
    </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component';
import DebugCanvas from '@/components/debug/DebugCanvas';

@Options({
    components: {
        DebugCanvas,
    },
})
export default class Export extends Vue {}
</script>
