<template>
    <div class="home">
        <Dashboard msg="App"/>
        <ready-fight></ready-fight>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Dashboard from '@/components/Dashboard.vue'; // @ is an alias to /src

export default defineComponent({
    name: 'IntroView',
    components: {
        Dashboard,
    },
});
</script>
