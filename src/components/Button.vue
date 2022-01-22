<template>
    <button class="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
        <slot></slot>
    </button>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class Button extends Vue {}
</script>
