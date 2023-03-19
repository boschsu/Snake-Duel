<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useStore } from '../store/index'
import { mutations } from '@/store/mutation'
interface Props {
    name ? : string
    score ? : number
}
let props: Props = reactive({
    name: 'John',
    score: 25,
});

function handleClick() {
    props.bar++;

    store.commit('CREATE_NEW_RECORD', {
        "id": 1,
        "rank": 1,
        "score": "99999",
        "player_name": "new player"
    })
}
let store = useStore();
let count = computed(() => {
    return store.getters.validRecordsCount
})
</script>
<template>
    <div class="ready" data-index="3">{{props.name}}</div>
    <div class="ready" data-index="2">{{props.score}}</div>
    <div class="ready" data-index="1">{{count}}</div>
    <button @click="handleClick">+1</button>
</template>
<style scoped lang="scss">
.ready {
    color: salmon;
}
</style>