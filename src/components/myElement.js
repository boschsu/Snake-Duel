import { defineCustomElement, ref, onMounted, getCurrentInstance } from 'vue'

var s1=require('../assets/countdown.wav');
const MyVueElement = defineCustomElement({
    
    props: {
        title: String,
    },
    emits: {
        change:null
    },
    template: `
    	<audio ref="countdown" src="`+s1+`"></audio>
    	<div class="countdown" ref="countdown_wrap">
	        <div ref="three" class="my" data-index="3" @click="handleClick(this)">{{title}}</div>
	        <div ref="two" class="my" data-index="2">2</div>
	        <div ref="one" class="my" data-index="1">1</div>
	        <div ref="zero" class="my" data-index="0">Fight</div>
        </div>
    `,

    
    styles: [`
    	.countdown {
    		display:none;
    	}
    	.countdown.active {
    		display:block;
    		position:absolute;
		    left: 0;
		    right: 0;
		    top: 0;
		    bottom: 0;
		    overflow:hidden;
    	}
        .my {
        	top:0;
            color: purple;
            opacity: 0;
            left: 0;
		    right: 0;
		    top: 0;
		    bottom: 0;
		    position: absolute;
		    z-index:9;
	        display: flex;
			align-items: center;
			justify-content: center;
        }
            .my.active {
                animation: 2s ease 0s 1 alternate countdown;
            }
            	.my.active[data-index="3"] {
            		animation-delay: 0s;
            	}
            	.my.active[data-index="2"] {
            		animation-delay: 1.4s;
            	}
            	.my.active[data-index="1"] {
            		animation-delay: 2.8s;
            	}
            	.my.active[data-index="0"] {
            		animation-duration: 1.4s;
            		animation-delay: 4.2s;
            	}
        @keyframes countdown {
		  	0% {
		    	transform: scale(1);
		    	opacity: 1;
		  	}
		  	66% {
		  		transform: scale(10);
		  		opacity:1;
		  	}
		  	100% {
		    	transform: scale(0);
		    	opacity: 1;
		  	}
		}    
    `],
    setup(props,context){
    	var three=ref();
    	var that2=getCurrentInstance()
    	const handleClick = (that) => {
    		that2.refs.countdown_wrap.classList.add('active');
            that2.refs.three.classList.add('active');
            that2.refs.two.classList.add('active');
            that2.refs.one.classList.add('active');
            that2.refs.zero.classList.add('active');
            that2.refs.countdown.play();
          	context.emit('change', {
            	title:'simple'
          	})
          	console.log('I emitted change',that)

        }	
        
        onMounted(()=>{
          	console.log(that2);
          	document.addEventListener('duel-prepared',function(e){
                handleClick();
            })
            that2.refs.zero.addEventListener('animationend',function(e){
                var ev1=new CustomEvent('duel-start',{
		            // detail:payload,
		        });
		        document.dispatchEvent(ev1);
		        that2.refs.countdown_wrap.classList.remove('active');
            })
      	})
        return { handleClick }
    }
})

customElements.define('my-vue-element', MyVueElement)
