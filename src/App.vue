<template>
    <Navbar />
    <div class="container mx-auto p-4 pt-20">
        <router-view />
    </div>
</template>

<script>
import Navbar from '@/components/navbar/Navbar';

export default {
    components: {
        Navbar,
    },
};
</script>
