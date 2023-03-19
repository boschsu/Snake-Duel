<script lang="ts">
import { defineComponent, ref, computed, onMounted, h, toRef, inject, getCurrentInstance } from 'vue';

export default defineComponent({
    name: 'EstablishedWorld',
    props: {
        width: Number,
        height: Number,
        unit: String,
        wormSize: String,
        lonelyWormX: Number,
        lonelyWormY: Number,
        gameStatus: Boolean,
        order: Number,
    },
    setup(props){
    	const i_curr=getCurrentInstance();
    	const changeCreated = inject('changeCreated')

        var data1=function() {
        	return '--data-width:'+(props.width as any)*2+props.unit+';--data-height:'+(props.height as any)*2+props.unit+';--data-bgcolor:#1212f0';
	    };

	    var data2=function(){
	    	var u=props.unit;

	    	return '--data-width:'+(props.wormSize as any).split('x')[0]+u+
	    			';--data-height:'+(props.wormSize as any).split('x')[1]+u+
	    			';--data-bgcolor:#ffffff'+
	    			';--data-offset-x:'+(props.lonelyWormX as any)+u+
                    ';--data-offset-y:'+(props.lonelyWormY as any)+u	
	    }

	    var destroy=function(){
	    	console.log(i_curr);
	    	// (i_curr as any).appContext.app.unmount()
	    }
        
        return {
            data1,
            data2,
            changeCreated,
            destroy,
        }
    },
    mounted(){
    	// (document.getElementById('world') as any).addEventListener('keyup',function(this: any){
    	// 	console.log(this)
    	// })
    }
})
</script>
<template>
    <div id="world" 
        :style="data1()"
    >
    	<span id="lonely-worm"
    		:style="data2()"
    		:class="{ active:gameStatus }"
    	>
    	</span>
    	<!-- <button @click="destroy()">Destroy</button> -->
    </div>
</template>
<style scoped lang="scss">
#world {
    background-color: var(--data-bgcolor);
    width: var(--data-width);
    height: var(--data-height);
    position: relative;

    span {
    	display: none;
    	background-color: var(--data-bgcolor);
	    width: var(--data-width);
	    height: var(--data-height);
	    position: absolute;
	    left: var(--data-offset-x);
    	top: var(--data-offset-y);

    	&.active {
    		display: block;
    	}
    }
}
</style>