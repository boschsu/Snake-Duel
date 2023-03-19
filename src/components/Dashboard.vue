<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
// import type { Ref } from 'vue'
import { RecordItem as CoolObject } from '@/state'

export default defineComponent({
    name: 'Dashboard',
    props: {
        msg: String,
    },
    data() {
    	return {
    		DashboardData1: 'string',
    	}
    },
    setup(){
    	var hadLiking = ref(true);
    	var likeAmount = ref(0);
    	var cart = ref([
    		{
    			name:'car',
    			quantity:2,
    			price:3000,
    		},
    		{
    			name:'keyboard',
    			quantity:10,
    			price:3,
    		},
    		{
    			name:'pig',
    			quantity:4,
    			price:300,
    		}
    	]);

    	onMounted(function(){
    		console.log('new VUE3 mounted')
    		fetchLike();
    	})
    	var url=(window as any).apiAddr+'/dashboard/1'

    	var fetchLike=function(){
    		
    		fetch(url,{
    			method: 'GET',
    		}).then(res=>{
    			res.json().then(result=>{
	    			likeAmount.value=result.postId
	    			hadLiking.value=false;
	    		})
    		})
    	}

    	var sendLike=function(){
    		hadLiking.value=true;
    		console.log('ok')
    		var body:CoolObject = {
					"id": 1,
			        "rank": 1,
			        "score": "99999",
			        "player_name": "new player"
    			}
    		console.log( JSON.stringify(body) )
    		fetch(
    			url,
    			{
    				method:'PUT',
    				headers: { 'Content-Type': 'application/json' },
    				body: JSON.stringify(body),
    			}
    		).then(res=>{

    			res.json().then(result=>{
	    			console.log('Dashboard settled.')
	    			fetchLike();
	    			
	    		})
	    	}).catch(err=>{
	    		console.error(err)
	    		hadLiking.value=false;
	    	});
    	}

    	var deleteItem=function(list:any,index:number):void{
		    list.splice(index,1)
		};

		var totalAmount=computed(function(){
			return cart.value.reduce((sum:number,item:any)=>{
				return sum += item.quantity*item.price
			},0)
		})

    	return {
    		cart,
    		totalAmount,
    		deleteItem,
    		likeAmount,
    		sendLike,
    		hadLiking,
    	}
    },
    created(){
    	console.log('old VUE2 created')
    },
    mounted(){
    	console.log(
    		'old VUE2 mounted ',
    		this.msg,
    		this.DashboardData1,
		)
    }
});
</script>
<template>
    <div class="hello">
        <h1>{{ totalAmount }}</h1>
        <button 
        	@click="sendLike()"
        	:disabled="hadLiking"
    	>{{ likeAmount?'Like '+likeAmount:'Loading' }}</button>
        <ul>
        	<li v-for="(item,index) in cart">
        		{{ item.name }}
        		<span> Qty. {{ item.quantity }}</span>
        		<button @click="deleteItem(cart,index)">Delete</button>
        	</li>
        </ul>
    </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
// li {
//     display: inline-block;
//     margin: 0 10px;
// }
a {
    color: #42b983;
}
</style>
