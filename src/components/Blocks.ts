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
function Blocks(props: Props, context: Context){

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
	        ';--data-bgcolor: hsl(0'+',0%'+',65%'+')'+
	        ';--data-offset-x:'+x+u+
	        ';--data-offset-y:'+y+u+
	        ';--data-order:'+i
    };

    return h(
        props.type,
        {
            class:'block-by-rival',
            payload: props.payload,
        	style: data1()
        },
        [
            h('span', 'simple block')
        ]
    );
}
export default Blocks