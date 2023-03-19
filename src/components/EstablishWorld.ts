import { h } from 'vue';
import { changeMovingDirection } from '../directives/changeMovingDirection'
interface Props {
    [key: string]:any;
}
interface Context {
    slots:any,
    attrs:any,
    emit:any,
    expose?:any,
}
function WormsWorld(props: Props, context: Context){

    var payload=props.payload;
    var data1=function() {
        return '--data-width:'+(payload.width as any)*2+payload.unit+';--data-height:'+(payload.height as any)*2+payload.unit+';--data-bgcolor:#121212';
    };

    var data2=function(){
        var u=payload.unit;

        return '--data-width:'+(payload.worm_size as any).split('x')[0]+u+
                ';--data-height:'+(payload.worm_size as any).split('x')[1]+u+
                ';--data-bgcolor:#ffffff'+
                ';--data-offset-x:'+(payload.lonely_worm_x as any)+u+
                ';--data-offset-y:'+(payload.lonely_worm_y as any)+u    
    }

    const handleChange = (event:KeyboardEvent) => {
        console.log('customChange emitted.')
        context.emit("changing", event)

        var ev1=new CustomEvent('custom-change',{
            detail:payload,
        });
        document.dispatchEvent(ev1);
    }

    return h(
        props.type,
        {
            class:'worms-world',
            payload: props.payload,
            worms: props.worms,
            timer: props.timer,
            style: data1(),
            index: props.payload.order,
            tabindex: props.payload.order,
            on:{
                Changing: function(){
                    console.log('got custom-change from h function created by World')
                },
            },
            onClick: handleChange,
            onKeyup: function(event:KeyboardEvent,payload:any){
                if (props.payload.mode==='') {
                    changeMovingDirection(event,props.payload)
                }
            },
            onMounted: (function(){
                // document.addEventListener('custom-change',function(this:any,e:any){
                //     console.log('World got custom event')
                // })
            })()
        },
        [
            h(
                'span',
                {
                    style: data2(),
                    class: payload.game_status ? 'active' : '',
                }
            ),
            context.slots.default()
        ]
    );
}
export default WormsWorld