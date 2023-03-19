<script lang="ts">
import { defineComponent, ref, computed, onMounted, h, toRef, inject, getCurrentInstance, nextTick } from 'vue';

export default defineComponent({
    name: 'EstablishedWorms',
    props: {
        order: {
            type: String,
            required: true,
        },
        payload: {
            type: Object,
            required: true,
        }
    },
    setup(props, context){        
    	var data1=function() {
            var w=props.payload.size.split('x')[0];
            var h=props.payload.size.split('x')[1];
            var u=props.payload.unit;
            var x=props.payload.offset_x;
            var y=props.payload.offset_y;
            // var offset_each_worm=Number(props.payload.size.split('x')[0])*(parseInt(props.order.split('worm')[1])-1);

            return '--data-width:'+w+u+
                    ';--data-height:'+h+u+
                    ';--data-bgcolor: hsl('+330/(context as any).attrs.total.value*(Number((props.order.split('worm')[1] as any)-1))+',100%'+',70%'+')'+
                    ';--data-offset-x:'+x+u+
                    ';--data-offset-y:'+y+u+
                    ';--data-order:'+props.order.split('worm')[1]
        };
        
        onMounted(function(){
            nextTick(()=>{
                (document.getElementById('world') as any).insertBefore((document.getElementById(props.order) as any),((document.getElementById('world') as any).childNodes[0] as any));
            })
        })

        return {
            data1,
        }
    },
})
</script>
<template>
    <div class="worm" :id="order" :style="data1()"><div class="slot"><slot /></div></div>
</template>
<style scoped lang="scss">
.worm {
    width: var(--data-width);
    height: var(--data-height);
    background-color: var(--data-bgcolor);
    position: absolute;
    left: var(--data-offset-x);
    top: var(--data-offset-y);
    border-radius: 100%;
    transform: scale(calc(10 / (9 + (var(--data-order) / 4))));

    .slot {
        display: none;
    }

    &.spark{
        animation: spark 1s forwards;
    }
}

@keyframes spark {
    0% {scale: 1;}
    50% {scale: 2;}
    100% {scale: 1;}
}
</style>