<script lang="ts">
import { defineComponent, onMounted } from 'vue';
export default defineComponent({
    name: 'App',
    setup(props){
    	
    }
});
</script>
<template>
    <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/snake">Snake Duel</router-link>
    </nav>
    <router-view />
</template>

<style lang="scss">
body {
	margin: 0;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

    nav {
	    padding: 0px;

	    a {
	    	font-size: 12px;
	        font-weight: bold;
	        color: #2c3e50;

	        &.router-link-exact-active {
	            color: #42b983;
	        }
	    }
	}
}
</style>
