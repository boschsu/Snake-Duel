import { h } from 'vue';
interface Props {
	[key: string]:any;
}
interface Context {
	slots:any,
	attrs:any,
	emit:any,
	expose?:any,
}
function Worms(props: Props, context: Context){

	var data1=function() {
        var w=props.payload.size.split('x')[0];
        var h=props.payload.size.split('x')[1];
        var u=props.payload.unit;
        var x=props.payload.offset_x;
        var y=props.payload.offset_y;
        var i=props.payload.index;
        // var offset_each_worm=Number(props.payload.size.split('x')[0])*(parseInt(props.order.split('worm')[1])-1);

        return '--data-width:'+w+u+
                ';--data-height:'+h+u+
                ';--data-bgcolor: hsl('+330/props.total*(i-1)+',100%'+',70%'+')'+
                ';--data-offset-x:'+x+u+
                ';--data-offset-y:'+y+u+
                ';--data-order:'+i
    };

	return h(
		props.type,
		{
			class:'worm',
			total: props.total,
			payload: props.payload,
	        style: data1()
		},
		[
			h('span', 'simple worm')
		]
	);
}
export default Worms

// function a1(){
//     var a={
//         b:{
//             c:1
//         }
//     }
//     function b() {
//         var d=a.b.c;
//         console.log(a.b.c)
//         console.log(d)
//         d--;
//         console.log(a.b.c)
//         console.log(d)
//         a.b.c=2
//         console.log(a.b.c)
//         console.log(d)
        
//     }
//     b()    
// }

// function a(){
//     var resultA=[]
//     var v1=0;    
//     var resultB=null;
//     [4,9].forEach(item=>{        
//         resultA.push( b(item) )
//     })
//     return resultA
//     function b(i){        
//         v1=Math.round(Math.random()*10);
//         if (!(v1===i)) {
//             b(i);
//         }else {
//             resultB=v1
//         }
//         return resultB
//     }
    
// }