<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, provide, createApp, nextTick, h, getCurrentInstance } from 'vue';
import EstablishWorld from '@/components/EstablishWorld.vue'
import WormsWorld from '@/components/EstablishWorld'
import Worms from '@/components/Worms'
import Blocks from '@/components/Blocks'
// import EstablishWorms from '@/components/EstablishWorms.vue'
import MyComponent from '@/components-functional/comp'
import WorldGenerator from '@/components/WorldGenerator'
import { changeMovingDirection } from '../directives/changeMovingDirection'
import '../components/myElement.js'
type T_Report = {
    weight: number;
    obstacled: boolean;
    nominated: boolean;
    name: string;
    level: number;
    steps: number;
    child: any[];
    catched: unknown;
};

var world=0;

function establishWorld1(this:any,e:Event,world_index:number){
    
}

function markCorner(world:any,direction:string,reference_coordinate:Array<number>,obstacleSet:any){
    var width_x=Number(world.payload.worm_size.split('x')[0]);
    var width_y=Number(world.payload.worm_size.split('x')[1]);
    var x=reference_coordinate && reference_coordinate[0],
        y=reference_coordinate && reference_coordinate[1];
    var tmp_x=x;
    var tmp_y=y;
    var last_correct_worm_x:unknown=undefined,
        last_correct_worm_y:unknown=undefined;
    var result=undefined;
    attemptFindNext();  

    function attemptFindNext(){
        if (direction==='left') {
                tmp_x-=width_x;
                if ( obstacleSet.has( tmp_x+'|'+tmp_y ) ) {
                    last_correct_worm_x=tmp_x;                          
                    attemptFindNext();
                }else {
                    result = [last_correct_worm_x,tmp_y];
                }
        }
        if (direction==='right') {
                tmp_x+=width_x;
                if ( obstacleSet.has( tmp_x+'|'+tmp_y ) ) {
                    last_correct_worm_x=tmp_x;                          
                    attemptFindNext();
                }else {
                    result = [last_correct_worm_x,tmp_y];
                }
        }
        if (direction==='up') {
                tmp_y-=width_y;
                if ( obstacleSet.has( tmp_x+'|'+tmp_y ) ) {
                    last_correct_worm_y=tmp_y;
                    attemptFindNext();
                }else {
                    result = [tmp_x,last_correct_worm_y];
                }
        }
        if (direction==='down') {
                tmp_y+=width_y;
                if ( obstacleSet.has( tmp_x+'|'+tmp_y ) ) {
                    last_correct_worm_y=tmp_y;
                    attemptFindNext();
                }else {
                    result = [tmp_x,last_correct_worm_y];
                }
        }
    }
    return result;
}

export default defineComponent({
    name: 'GameView',
    components:{
        EstablishWorld,
        // EstablishWorms,
        MyComponent,
        WormsWorld,
        Worms,
        Blocks,
        WorldGenerator,
    },
    setup(props){
        // var worms:any[]=[];
        // var world_established:any=ref(false)
        // var half_width=ref();
        // var half_height=ref();
        // var p_half_width=ref(100);
        var p_half_width1:any=ref([]);
        var p_half_height1:any=ref([]);
        var p_worm_size1:any=ref([]);
        var p_unit1:any=ref([]);
        // var p_half_height=ref(100);
        // var unit=ref();
        // var p_unit=ref('px');
        // var worm_counter=1;
        // var speed=ref(100);
        var speed_init=1000;
        // var game_status=ref(false);

        // var worm_size=ref();
        // var p_worm_size=ref(10);
        var worm_movement:ReturnType<typeof setTimeout>=0;
        // var worm_movement_frame:ReturnType<typeof requestAnimationFrame>;
        // var lonely_worm_x=ref();
        // var lonely_worm_y=ref();
        // var lonely_worm_x1=ref();
        // var lonely_worm_y1=ref();
        // var first_worm_direction:String|unknown=new String();        
        // var automatic_run=false;
        // var next_direction:string|unknown='right';
        // var directionChanged=false;
        // var last_step='y';
        var duelWorld0:any=null;
        var duelWorld1:any=null;

        var last_time:number=0;
        var count:number=0;

        var world_orders:any=ref([]);

        var worlds:any=ref([]);
        var world_order:any=ref(0);
        var payload:any=ref();
        var worms_data:any=ref([]);
        var worms_data_key:any=ref(0);
        var values=ref([
            {
                type: 'h1',
                content:'Heading',
            },
            {
                type: 'h2',
                content:'Breaking News',
            },  
        ]);
        var total=ref();

        function ComputedWormSize(value: number=1){

            // half_width.value=p_half_width.value%value!==0
                                    //          ?Math.ceil(p_half_width.value/value)*value
                                    //          :p_half_width.value;
         //    half_height.value=p_half_height.value%value!==0
                                    //          ?Math.ceil(p_half_height.value/value)*value
                                    //          :p_half_height.value;
            return value+'x'+value;
        }

        var establishWorld=function(this:any,e:Event,world_index:number){
            world_orders.value[world_index].world={             
                type:'div',
                active: true,
                payload: {                  
                    order: world_index,
                    width: p_half_width1.value[world_index],
                    height: p_half_height1.value[world_index],
                    unit: p_unit1.value[world_index],
                    worm_size: ComputedWormSize(p_worm_size1.value[world_index]),
                    lonely_worm_x: 0,
                    lonely_worm_y: 0, 
                    game_status: false,
                    first_worm_direction: 'pause',
                    directionChanged: false,
                    worms_key: 0,
                    last_correct_x: 0,
                    last_correct_y: 0,
                    next_x: 0,
                    next_y: 0,
                    speed: speed_init,
                    next_step: [],
                    next_direction: null,
                    automatic_run: false,
                    last_step: 'y',
                    mode: '',
                },
                timer: {
                    worm_movement_frame: null,
                    last_time: 0,
                    count: 0,
                },
                worms: [],
                blocks: [],
            };
        }

        // var establishWorms=defineComponent({
        //     extends: EstablishWorms,
        // })

        function speedFix(world:any){
            if (world.payload.speed > 50) {
                world.payload.speed=speed_init*(Math.pow(.9,world.worms.length||1));
            }
        }

        function getDirectionOfLastWorm(world:any,worms:any):string{
            if (worms.length===0) {
                return '';
            }
            if (worms.length===1) {
                return world.first_worm_direction;
            }
            var last_worm:any=worms.slice(-1).pop();
            var second_last_worm:any=worms.slice(0,-1).pop();
            // var x1=last_worm._.subTree.component.props.payload.previous_offset_x;
            var x1=last_worm.payload.previous_offset_x;
            var x2=second_last_worm.payload.previous_offset_x;
            var y1=last_worm.payload.previous_offset_y;
            var y2=second_last_worm.payload.previous_offset_y;
            if (x1===x2) {
                if (y1>y2) {
                    return 'up'
                }else {
                    return 'down'
                }
            }else if (y1===y2) {
                if (x1>x2) {
                    return 'left'
                }else {
                    return 'right'
                }
            }else {
                return 'error to get direction.'
            }
        }

        var establishWorm=function(e:Event,world:any,by_save?:boolean){
            if (!world.hasOwnProperty('active')){
                console.error('You need careate a world first.');
                return false;
            }
            var payload=world.payload;
            var worms=world.worms;
            var worms_length=worms.length||0;
            var offset_each_worm=Number(payload.worm_size.split('x')[0])*worms_length;
            var size_x=payload.worm_size.split('x')[0];
            var size_y=payload.worm_size.split('x')[1];
            // const wrapper = document.createElement("div");
            
            var last_worm:any=worms.slice(-1).pop();
            var last_worm_direction:string=getDirectionOfLastWorm(payload,worms);
            interface calcXY {
                _x:number;
                _y:number;
            }

            function calcXY():any{
                var result=null;
                if (by_save) {
                    
                    if (last_worm_direction==='up') {
                        result = {
                            _x:last_worm.payload.offset_x,
                            _y:last_worm.payload.offset_y+Number(size_y)
                        }   
                    }
                    if (last_worm_direction==='right') {
                        result = {
                            _x:last_worm.payload.offset_x-Number(size_x),
                            _y:last_worm.payload.offset_y,
                        }   
                    }
                    if (last_worm_direction==='down') {
                        result = {
                            _x:last_worm.payload.offset_x,
                            _y:last_worm.payload.offset_y-Number(size_y)
                        }   
                    }
                    if (last_worm_direction==='left') {
                        result = {
                            _x:last_worm.payload.offset_x+Number(size_x),
                            _y:last_worm.payload.offset_y
                        }
                    }
                }else {
                    result = {
                        _x:payload.width-offset_each_worm,
                        _y:payload.height,
                    }
                }
                return result;
            }
            
            worms.push({
                type: 'div',
                payload: {
                    offset_x: calcXY()._x,
                    offset_y: calcXY()._y,
                    previous_offset_x: 0,
                    previous_offset_y: 0,
                    size: payload.worm_size,
                    unit: payload.unit,
                    index: worms_length,
                },
            })
          //   var _=createApp({ 
                //     setup () {
                //      return () => h(EstablishWorms, {
                //                                          order: "worm"+worm_counter,
                //                                          total: total,
                //                                          payload: {
                //                                              offset_x: calcXY()._x,
                //                                              offset_y: calcXY()._y,
                //                                              previous_offset_x: 0,
                //                                              previous_offset_y: 0,
                //                                              size: worm_size.value,
                //                                              unit: unit.value,
                //                                          },
                //                                      }, ()=>{ return "default slot as children"})
                //     }
                // }).mount(wrapper);
            // worms.push(_ as never);
            // worm_counter++;
            // (document.getElementById('app') as any).appendChild(wrapper);
            // total.value=worms.length;
            // console.log(_._.subTree.component,'rendered.');            
        }

        function startMovement(this:any,e:Event,world:any,that:any){
            stopMovement(e,world);
            if (world.worms.length) {
                if ((this||that).$refs) {
                    (this||that).$refs['world'+world.payload.order][0].focus();
                }else {
                    (this||that).refs['world'+world.payload.order][0].focus();
                }
                generateLonelyWorm(e,false,world);
                speedFix(world);
                world.payload.first_worm_direction='right';
                letsRock(world);
                world.payload.game_status=true;             
            }
        }

        function stopMovement(e:Event,world:any){
            if (worm_movement || world.timer.worm_movement_frame) {
                // clearInterval(worm_movement);
                cancelAnimationFrame(world.timer.worm_movement_frame);
                world.payload.game_status=false;
            }
        }

        function movingUpdate(obj:any){

            obj._.subTree.component.update();
        }

        function checkLonelyWormSaved(this:any,e:Event,world?:any){
            var worms=world.worms;
            var blocks=world.blocks;            
            var sets_worms:any=new Set();
            var sets_blocks:any=new Set();
            worms.forEach((item:any)=>{
                sets_worms.add( item.payload.offset_x+'|'+item.payload.offset_y );             
            })
            blocks.forEach((item:any)=>{
                sets_blocks.add( item.payload.offset_x+'|'+item.payload.offset_y );             
            })
            var sets_xy:any=new Set([ ...sets_worms ]);
            var width=world.payload.width*2;
            var height=world.payload.height*2;
            var worm0_x=worms[0].payload.offset_x;
            var worm0_y=worms[0].payload.offset_y;

            if ( world.payload.lonely_worm_x===worm0_x && world.payload.lonely_worm_y===worm0_y) {
                console.log('World '+world.payload.order+' save a lonely worm!');
                var worm0_el=(document as any).querySelector('.worms-world[index="'+world.payload.order+'"]').firstElementChild.nextElementSibling;
                worm0_el && worm0_el.classList.add('spark');
                setTimeout(function(){
                    worm0_el && worm0_el.classList.remove('spark');
                },world.payload.speed);
                establishWorm(e,world,true);                
                if (world.payload.mode==='duel') {
                    generateBlockToRival(world);    
                }
                generateLonelyWorm(e,false,world);
                speedFix(world);
                stopMovement(e,world);
                letsRock(world);
            }else {
                if (sets_blocks.has(worm0_x+'|'+worm0_y)) {
                    stopMovement(e,world);
                    console.log('world',world.payload.order,'Block touch detected. Game over.')    
                }
                if (worm0_x<0||worm0_y<0||worm0_x>=width||worm0_y>=height) {
                    stopMovement(e,world);
                    console.log('world',world.payload.order,'Out of bound detected. Game over.')
                }
                if (sets_xy.size<worms.length) {
                    stopMovement(e,world);
                    console.log('world',world.payload.order,'Conflict detected. Game over.')    
                }
            }
        }

        function move(world:any){
            var worms=world.worms;
            var first_worm_direction=world.payload.first_worm_direction;
            var worm_size=world.payload.worm_size;
            worms.forEach((item:any,index:number)=>{
                item.payload.previous_offset_x=item.payload.offset_x;
                item.payload.previous_offset_y=item.payload.offset_y;

                if (index===0) {                    
                    if (first_worm_direction==='up') {
                        item.payload.offset_y-=Number(worm_size.split('x')[1]);
                        first_worm_direction='up';
                    }
                    if (first_worm_direction==='right') {
                        item.payload.offset_x+=Number(worm_size.split('x')[0]);
                        first_worm_direction='right';
                    }
                    if (first_worm_direction==='down') {
                        item.payload.offset_y+=Number(worm_size.split('x')[1]);
                        first_worm_direction='down';
                    }
                    if (first_worm_direction==='left') {
                        item.payload.offset_x-=Number(worm_size.split('x')[0]);
                        first_worm_direction='left';
                    }
                }else {
                    item.payload.offset_x=worms[index-1].payload.previous_offset_x;
                    item.payload.offset_y=worms[index-1].payload.previous_offset_y;
                }                   
                // var o1=item as any;
                world.payload.worms_key++;
                // movingUpdate(o1);
            })
            world.payload.directionChanged=false;
        }

        function run(hi_res_time_stamp_from_raf_callback?:number,world?:any) {
            world.timer.last_time=world.timer.last_time || hi_res_time_stamp_from_raf_callback;
            if (hi_res_time_stamp_from_raf_callback && hi_res_time_stamp_from_raf_callback-world.timer.last_time>world.payload.speed) {
                world.timer.count++;
                world.timer.last_time=hi_res_time_stamp_from_raf_callback;
                rockTimer(world);
            }
            if (world.payload.game_status===false) {
                return false;
            }
            world.timer.worm_movement_frame = requestAnimationFrame(function(hi_res_time_stamp_from_raf_callback){
                run(hi_res_time_stamp_from_raf_callback,world)  
            });
        }

        function letsRock(world?:any){
            world.payload.game_status=true;         
            run(0,world);
            // worm_movement=setInterval(function(){rockTimer(first_worm_direction as string)},speed.value);
        }

        function rockTimer(world:any){
            var e:Event=new Event('simple');
            world.payload.first_worm_direction  = world.payload.automatic_run
                                                ? runStratage(world)
                                                : world.payload.first_worm_direction;
            // console.log('next direction: ', world.payload.next_direction);
            move(world);
            checkLonelyWormSaved(e,world);
        }

        

        function runStratage(world:any){
            var worms=world.worms;
            var x=worms[0].payload.offset_x;
            var y=worms[0].payload.offset_y;            
            world.payload.last_correct_x=worms[0].payload.offset_x;
            world.payload.last_correct_y=worms[0].payload.offset_y;
            var last_correct_x=world.payload.last_correct_x;
            var last_correct_y=world.payload.last_correct_y;
            world.payload.next_x=x;
            world.payload.next_y=y;
            var map_x=world.payload.width*2;
            var map_y=world.payload.height*2;
            var target_x=world.payload.lonely_worm_x;
            var target_y=world.payload.lonely_worm_y;
            var width_x=Number(world.payload.worm_size.split('x')[0]);
            var width_y=Number(world.payload.worm_size.split('x')[1]);
            var remain_x=Math.abs(x-target_x)/width_x;
            var remain_y=Math.abs(y-target_y)/width_y;          
            
            //load obstacles
            var obstacleSet_bound=new Set();
            var obstacleSet_worm=new Set();
            for (var xi=0,yi=-width_y;xi<map_x;xi+=width_x) {
                obstacleSet_bound.add(xi+'|'+yi);
            }
            for (var xi=-width_x,yi=0;yi<map_y;yi+=width_y) {
                obstacleSet_bound.add(xi+'|'+yi);
            }
            for (var xi=0,yi=map_y;xi<map_x;xi+=width_x) {
                obstacleSet_bound.add(xi+'|'+yi);
            }
            for (var xi=map_x,yi=0;yi<map_y;yi+=width_y) {
                obstacleSet_bound.add(xi+'|'+yi)
            }
            worms.forEach((item:any,index:number)=>{
                if (index!==worms.length-1) {}
                obstacleSet_worm.add(item.payload.offset_x+'|'+item.payload.offset_y);  
            })
            var obstacleSet=new Set([...obstacleSet_bound,...obstacleSet_worm]);

            automaticStratage(world);

            if (world.payload.next_step[0]>x) {
                world.payload.next_direction = 'right'
            }
            if (world.payload.next_step[0]<x) {
                world.payload.next_direction = 'left'
            }
            if (world.payload.next_step[1]>y) {
                world.payload.next_direction = 'down'
            }
            if (world.payload.next_step[1]<y) {
                world.payload.next_direction = 'up'
            }
            if (!world.payload.next_step.length) {
                world.payload.next_direction = null;
            }           
            return world.payload.next_direction;
            
            function automaticStratage(world:any,fix?:boolean){
                var last_step=world.payload.last_step;
                var obstacle_from_up=false;
                var obstacle_from_right=false;
                var obstacle_from_down=false;
                var obstacle_from_left=false;
                var next_direction=world.payload.next_direction;
                var obstacle_report:T_Report[]=checkObstacle(last_correct_x,last_correct_y);
                var one_path_left:T_Report[]=obstacle_report.filter(item=>{
                    return item.obstacled===false
                })

                if (one_path_left.length===3) {
                    // console.log('world',world.payload.order,'enter pathFinder Level1');
                    pathPredictLevel4();
                    // checkout(world);
                }
                if (one_path_left.length===2) {
                    // console.log('world',world.payload.order,'enter pathFinder Level2');
                    pathPredictLevel4();
                }
                if (one_path_left.length===1) {
                    // console.log('world',world.payload.order,'enter pathFinder Level3');
                    pathPredictLevel3(one_path_left);
                }

                function pathPredictLevel3(one_path_left:T_Report[]){
                    var name=one_path_left[0].name;
                    if (name==='up') {
                        world.payload.next_x=last_correct_x;
                        world.payload.next_y=last_correct_y-width_y;
                    }
                    if (name==='right') {
                        world.payload.next_x=last_correct_x+width_x;
                        world.payload.next_y=last_correct_y;
                    }
                    if (name==='down') {
                        world.payload.next_x=last_correct_x;
                        world.payload.next_y=last_correct_y+width_y;
                    }
                    if (name==='left') {
                        world.payload.next_x=last_correct_x-width_x;
                        world.payload.next_y=last_correct_y;
                    }
                    setNextStep(world);
                    world.payload.next_step = [world.payload.next_x, world.payload.next_y];
                }
                function pathPredictLevel2(){
                    var or0=(obstacle_report as any)[0],
                        or1=(obstacle_report as any)[1],
                        or2=(obstacle_report as any)[2],
                        or3=(obstacle_report as any)[3];
                    var obstacle_from_up_amount=0,
                        obstacle_from_down_amount=0,
                        obstacle_from_left_amount=0,
                        obstacle_from_right_amount=0;
                    obstacleSet_worm.forEach((item:any)=>{
                        if (next_direction==='left'||next_direction==='right') {
                            if (Number(item.split('|')[1])>last_correct_y) {
                                obstacle_from_down_amount++;
                            }
                            if (Number(item.split('|')[1])<last_correct_y) {
                                obstacle_from_up_amount++;
                            }
                        }
                        if (next_direction==='up'||next_direction==='down') {
                            if (Number(item.split('|')[0])>last_correct_x) {
                                obstacle_from_right_amount++;
                            }
                            if (Number(item.split('|')[0])<last_correct_x) {
                                obstacle_from_left_amount++;
                            }
                        }
                        if (Number(item.split('|')[0])===last_correct_x) {
                            if (Number(item.split('|')[1])>last_correct_y) {                                
                                obstacle_from_down=true;
                            }
                            if (Number(item.split('|')[1])<last_correct_y) {
                                obstacle_from_up=true;
                            }
                        }
                        if (Number(item.split('|')[1])===last_correct_y) {
                            if (Number(item.split('|')[0])>last_correct_x) {
                                obstacle_from_right=true;
                            }
                            if (Number(item.split('|')[0])<last_correct_x) {
                                obstacle_from_left=true;
                            }
                        }
                    });

                    //obstacle from next one
                    // if (obstacleSet.has(last_correct_x+'|'+(last_correct_y+width_y))) {
                    //  or0.weight++;
                    //  or2.weight--;
                    // }
                    // if (obstacleSet.has(last_correct_x+'|'+(last_correct_y-width_y))) {
                    //  or0.weight--;
                    //  or2.weight++;
                    // }
                    // if (obstacleSet.has(last_correct_x+width_x+'|'+last_correct_y)) {
                    //  or1.weight--;
                    //  or3.weight++;
                    // }
                    // if (obstacleSet.has(last_correct_x-width_x+'|'+last_correct_y)) {
                    //  or1.weight++;
                    //  or3.weight--;
                    // }
                    //obstacle form away
                    if (obstacle_from_left) {   
                        or3.weight--;
                        or1.weight++;
                    }
                    if (obstacle_from_right) {
                        or1.weight--;
                        or3.weight++;
                    }
                    if (obstacle_from_up) {
                        or0.weight--;
                        or2.weight++;
                    }
                    if (obstacle_from_down) {
                        or2.weight--;
                        or0.weight++;
                    }
                    //target instant direction 
                    if (last_correct_x>target_x) {
                        or1.weight-=1;
                        or3.weight+=1;
                        
                    }if (last_correct_x<target_x) {
                        or1.weight+=1;
                        or3.weight-=1;
                    }                   
                    if (last_correct_y<target_y) {
                        or0.weight-=1;
                        or2.weight+=1;                      
                    }
                    if (last_correct_y>target_y) {
                        or0.weight+=1;
                        or2.weight-=1;
                    }
                    //same weight compare the total obstacle amount
                    if (obstacle_report[0].weight===obstacle_report[2].weight && obstacle_report[0].weight>=obstacle_report[1].weight) { //up and down has same weight
                        if (obstacle_from_up_amount>obstacle_from_down_amount) {
                            obstacle_report[2].weight++;
                            obstacle_report[0].weight--;
                        }else if (obstacle_from_up_amount<obstacle_from_down_amount) {
                            obstacle_report[0].weight++;
                            obstacle_report[2].weight--;
                        }
                    }
                    if (obstacle_report[1].weight===obstacle_report[3].weight && obstacle_report[1].weight>=obstacle_report[2].weight) {
                        if (obstacle_from_left_amount>obstacle_from_right_amount) {
                            obstacle_report[1].weight++;
                            obstacle_report[3].weight--;
                        }else if (obstacle_from_left_amount<obstacle_from_right_amount) {
                            obstacle_report[3].weight++;
                            obstacle_report[1].weight--;
                        }
                    }
                    //avoid direction to wrong way
                    var weights=(obstacle_report as unknown as Object[]).map((item:any) => {
                        item.weight =item.obstacled
                                    ?item.weight-1
                                    :item.weight+1;
                        return item.weight;
                    });

                    var nominated_index=weights.indexOf(Math.max(...weights));
                    (obstacle_report[nominated_index as unknown as keyof typeof obstacle_report] as unknown as any).nominated=true;

                    console.log(obstacle_report);
                    if (obstacle_report[0].obstacled!==true && obstacle_report[0].nominated) {//up
                        world.payload.next_x=last_correct_x;
                        world.payload.next_y=last_correct_y-width_y;
                        world.payload.last_step='y';
                    }
                    else if (obstacle_report[1].obstacled!==true && obstacle_report[1].nominated) {//right
                        world.payload.next_x=last_correct_x+width_x;
                        world.payload.next_y=last_correct_y;
                        world.payload.last_step='x';
                    }
                    else if (obstacle_report[2].obstacled!==true && obstacle_report[2].nominated) {//down
                        world.payload.next_x=last_correct_x;
                        world.payload.next_y=last_correct_y+width_y;
                        world.payload.last_step='y';
                    }
                    else if (obstacle_report[3].obstacled!==true && obstacle_report[3].nominated) {//left
                        world.payload.next_x=last_correct_x-width_x;
                        world.payload.next_y=last_correct_y;
                        world.payload.last_step='x';
                    }else {
                        pathPredictLevel1();
                    }
                    setNextStep(world);
                    world.payload.next_step = [world.payload.next_x,world.payload.next_y];
                }               
                function pathPredictLevel1(){
                    if (remain_x+remain_y>0) {
                        if (remain_y>0) {
                            target_y>=last_correct_y
                                    ?world.payload.next_y=last_correct_y+width_y
                                    :world.payload.next_y=last_correct_y-width_y;
                            remain_y--;
                            world.payload.last_step='y';
                        }else if (remain_x>0) {
                            target_x>=last_correct_x
                                    ?world.payload.next_x=last_correct_x+width_x
                                    :world.payload.next_x=last_correct_x-width_x;
                            remain_x--;
                            world.payload.last_step='x';
                        }else if (remain_y===0) {
                            target_x>x
                                    ?world.payload.next_x=world.payload.next_x+width_x
                                    :world.payload.next_x=world.payload.next_x-width_x;
                            remain_x--;
                            world.payload.last_step='x';
                        }else if (remain_x===0){
                            target_y>y
                                    ?world.payload.next_y=world.payload.next_y+width_y
                                    :world.payload.next_y=world.payload.next_y-width_y;
                            remain_y--;
                            world.payload.last_step='y';
                        }
                    }                   
                }
                function pathPredictLevel4(){
                    var choose_another_way=depthPredict(last_correct_x,last_correct_y);
                    if (!choose_another_way.length) {
                        typicallyObstacle()
                    }else {
                        // var the_way=choose_another_way.filter(item=>{
                        //     return (item as any).level2_unobstacle_way===Math.max.apply(null,choose_another_way.map(_item=>{
                        //             return (_item as any).level2_unobstacle_way
                        //         }))
                        // });

                        var _direction:any=(choose_another_way[choose_another_way.findIndex((ite:any)=>{
                            return ite.level===Math.min.apply('',choose_another_way.map((item:any)=>{
                                            return item.level
                                        }))
                        })] as any).direction;
                        // choose_another_way.filter(item:any=>{
                        //     return item.level
                        // })
                        var scout_x=last_correct_x;
                        var scout_y=last_correct_y;

                        // if (the_way.length===1) {
                        //     debugger;
                            // var _direction:any=choose_another_way[0];
                        // debugger
                            if (_direction==='up'){
                                scout_y=scout_y-width_y;
                            }
                            if (_direction==='right'){
                                scout_x=scout_x+width_x;
                            }
                            if (_direction==='down'){
                                scout_y=scout_y+width_y;
                            }
                            if (_direction==='left'){
                                scout_x=scout_x-width_x;
                            }
                            world.payload.next_x=scout_x;
                            world.payload.next_y=scout_y;
                            setNextStep(world);
                            world.payload.next_step = [world.payload.next_x,world.payload.next_y];
                        // }else {
                        //     pathPredictLevel2();
                        // }
                    }
                }
                function depthPredict(last_correct_x:number,last_correct_y:number):object[]{
                    var obs:Set<unknown|string>=new Set(obstacleSet);
                    var captured=false;
                    var first:unknown|string=null;
                    var result:any[]=[];
                    var path_map=[
                        {
                            name: 'up',
                            level:0,
                            steps:0,
                            child:[],
                            catched: null,
                        },
                        {
                            name: 'right',
                            level:0,
                            steps:0,
                            child:[],
                            catched: null,
                        },
                        {
                            name: 'down',
                            level:0,
                            steps:0,
                            child:[],
                            catched: null,
                        },
                        {
                            name: 'left',
                            level:0,
                            steps:0,
                            child:[],
                            catched: null,
                        },
                    ];
                    var obstacled_path:unknown|boolean=null;
                    obstacle_report.forEach((item,index)=>{
                        if (!item.obstacled) {
                            obs=new Set(obstacleSet);
                            path_map[index]=checkObstacleNext(item,last_correct_x,last_correct_y,false,false);
                        }
                    })
                    path_map.forEach(item=>{
                        search(item)   
                    })
                    console.log(path_map)
                    return result;

                    function search(obj:any){
                        // debugger
                        if (!first) {
                            first=obj.name
                        }
                        if ('level' in obj) {
                            if (obj.level===0) {
                                first=obj.name
                            }
                        }
                        if (obj.catched===true ){
                            //console.log(first,'level',obj.level)    
                            result.push({
                                direction:first,
                                level:obj.level
                            })
                        }else {
                            // console.log('level'+obj.level,obj.step)
                            if (obj.child) {
                                obj.child.forEach((item:any)=>{
                                    search(item)
                                })
                            }        
                        }
                    }
                    function checkObstacleBetween(scout_x:number,scout_y:number,axis:string):boolean{
                        var check_result=false;
                        // debugger
                        if (axis==='x') {
                            for (var i=0;i<Math.abs(scout_y-target_y)/width_y;i++) {
                                if (obs.has(scout_x+'|'+i*width_y)) {
                                    check_result=true;
                                    break;
                                }
                            }
                        }
                        if (axis==='y') {
                            for (var i=0;i<Math.abs(scout_x-target_x)/width_x;i++) {
                                if (obs.has(i*width_x+'|'+scout_y)) {
                                    check_result=true;
                                    break;
                                }
                            }
                        }
                        return check_result;
                    }
                    function checkObstacleNext(obj:any,scout_x:number,scout_y:number,child:boolean,changing:boolean){
                        var level=child
                                    ?obj.level+1
                                    :obj.level+1;
                        var child_way=null;
                        var change_way=null;
                        var direction=obj.name;
                        if (direction==='up'){
                            scout_y=scout_y-width_y;
                        }
                        if (direction==='right'){
                            scout_x=scout_x+width_x;
                        }
                        if (direction==='down'){
                            scout_y=scout_y+width_y;
                        }
                        if (direction==='left'){
                            scout_x=scout_x-width_x;
                        }
                        obstacled_path=obs.has(scout_x+'|'+scout_y);
                        // debugger
                        if (!obstacled_path) {
                            if (scout_x===target_x && scout_y===target_y) {
                                obj.steps++;
                                obj.catched=true;
                                // captured=true;
                            }else {
                                if (scout_x===target_x) {
                                    if (!checkObstacleBetween(scout_x,scout_y,'x')) {
                                        if (scout_y>target_y) {
                                            change_way='up';
                                        }else {
                                            change_way='down';
                                        }
                                    }
                                }
                                if (scout_y===target_y) {
                                    if (!checkObstacleBetween(scout_x,scout_y,'x')) {
                                        if (scout_x>target_x) {
                                            change_way='left';
                                        }else {
                                            change_way='right';
                                        }
                                    }
                                }
                                if (change_way && !captured) {
                                    obj.steps++;
                                    obs.add(scout_x+'|'+scout_y);
                                    if (changing) {
                                        checkObstacleNext(obj,scout_x,scout_y,false,true);
                                    }else {
                                        obj.child.push( checkObstacleNext({
                                            name:change_way,
                                            level:level,
                                            steps:0,
                                            child:[],
                                            catched:null,
                                        },scout_x,scout_y,true,true) )
                                    }
                                }else {
                                    obj.steps++;
                                    obs.add(scout_x+'|'+scout_y);
                                    // console.log(obs);
                                    if (!captured) {
                                        checkObstacleNext(obj,scout_x,scout_y,false,false);
                                    }
                                }
                            }
                        }else if (obstacled_path) {//level2 scout
                            if (direction==='up'){
                                scout_y=scout_y+width_y;
                            }
                            if (direction==='right'){
                                scout_x=scout_x-width_x;
                            }
                            if (direction==='down'){
                                scout_y=scout_y-width_y;
                            }
                            if (direction==='left'){
                                scout_x=scout_x+width_x;
                            }
                            child_way=checkObstacle(scout_x,scout_y,obs).filter(item=>{
                                                    return !item.obstacled
                                                });
                            var child_way_length=child_way.length
                            if (child_way_length>0 && level<5 && !captured) {
                                child_way.forEach(item=>{
                                    obj.child.push( checkObstacleNext({
                                        name:item.name,
                                        level:level,
                                        steps:0,
                                        child:[],
                                        catched:null,
                                    },scout_x,scout_y,true,false) )
                                })
                            }
                        }
                        return obj;
                    }
                }
                function typicallyObstacle(){
                    if ( obstacleSet_worm.has((last_correct_x+width_x)+'|'+last_correct_y) && next_direction==='right' ) {//predict by rectangle right
                        console.log('enter predict right');
                        // debugger;
                        //check only one path left
                        // if (one_path_left.length===1) {
                        //  pathPredictLevel3(one_path_left);
                        // }else {
                            var corner1:Array<number>=markCorner(world,'left',[last_correct_x,last_correct_y],obstacleSet_worm)!; //behind by worm[0]
                            var corner2:any=undefined;
                            var corner2_a:Array<number>=markCorner(world,'up',corner1,obstacleSet_worm)!;
                            var corner2_b:Array<number>=markCorner(world,'down',corner1,obstacleSet_worm)!;
                            if (corner2_b.indexOf(undefined as unknown as number)===-1) {
                                corner2=corner2_b
                            }
                            if (corner2_a.indexOf(undefined as unknown as number)===-1) {
                                corner2=corner2_a
                            }
                            var corner3:Array<number>=markCorner(world,'right',corner2,obstacleSet_worm)!;
                            var predicted_obstacle=[last_correct_x+width_x,last_correct_y]; //front by worm[0], obstacleSet.has((next_x-width_x)+'|'+next_y)
                            if (corner3.indexOf(undefined as unknown as number)>-1) {
                                pathPredictLevel2();
                            }else {
                                if (predicted_obstacle[0]>corner1[0] && predicted_obstacle[1]===corner1[1]) {
                                    // |----->|
                                    // |      |
                                    // |      |
                                    // |------|
                                    if (corner1[1]<corner2[1] && corner1[0]===corner2[0]) {
                                        if (corner2[0]<corner3[0] && corner2[1]===corner3[1]) {
                                            //now forming a rectangle                               
                                            world.payload.next_x=last_correct_x;
                                            world.payload.next_y=last_correct_y-width_y;
                                            // remain_y--;
                                            // last_step='y'
                                            if (obstacleSet.has(world.payload.next_x+'|'+world.payload.next_y)) {
                                                pathPredictLevel2();
                                            }else {
                                                setNextStep(world);
                                                world.payload.next_step = [world.payload.next_x, world.payload.next_y];
                                            }
                                        }
                                    }
                                    // |------|
                                    // |      |
                                    // |      |
                                    // |----->|
                                    if (corner1[1]>corner2[1] && corner1[0]===corner2[0]) {
                                        if (corner2[0]<corner3[0] && corner2[1]===corner3[1]) {
                                            //now forming a rectangle                               
                                            world.payload.next_x=last_correct_x;
                                            world.payload.next_y=last_correct_y+width_y;
                                            // remain_y--;
                                            // last_step='y'
                                            if (obstacleSet.has(world.payload.next_x+'|'+world.payload.next_y)) {
                                                pathPredictLevel2();
                                            }else {
                                                setNextStep(world);
                                                world.payload.next_step = [world.payload.next_x, world.payload.next_y];
                                            }
                                        }
                                    }
                                }else {
                                    console.log('predict right error')
                                }
                            }
                        // }
                    }else if ( obstacleSet_worm.has((last_correct_x-width_x)+'|'+last_correct_y) && next_direction==='left' ) {//predict by rectangle direction left
                        console.log('enter predict left');
                        // debugger;
                        //check only one path left
                        // if (one_path_left.length===1) {
                        //  pathPredictLevel3(one_path_left);
                        // }else {
                            var corner1:Array<number>=markCorner(world,'right',[last_correct_x,last_correct_y],obstacleSet_worm)!; //behind by worm[0]
                            var corner2:any=undefined;
                            var corner2_a:Array<number>=markCorner(world,'up',corner1,obstacleSet_worm)!;
                            var corner2_b:Array<number>=markCorner(world,'down',corner1,obstacleSet_worm)!;
                            if (corner2_b.indexOf(undefined as unknown as number)===-1) {
                                corner2=corner2_b
                            }
                            if (corner2_a.indexOf(undefined as unknown as number)===-1) {
                                corner2=corner2_a
                            }
                            var corner3:Array<number>=markCorner(world,'left',corner2,obstacleSet_worm)!;
                            var predicted_obstacle=[last_correct_x-width_x,last_correct_y]; //front by worm[0], obstacleSet.has((next_x-width_x)+'|'+next_y)
                            if (corner3.indexOf(undefined as unknown as number)>-1) {
                                pathPredictLevel2();
                            }else {
                                if (predicted_obstacle[0]<corner1[0] && predicted_obstacle[1]===corner1[1]) {
                                    // |<-----|
                                    // |      |
                                    // |      |
                                    // |------|
                                    if (corner1[1]<corner2[1] && corner1[0]===corner2[0]) {
                                        if (corner2[0]>corner3[0] && corner2[1]===corner3[1]) {
                                            //now forming a rectangle                               
                                            world.payload.next_x=last_correct_x;
                                            world.payload.next_y=last_correct_y-width_y;
                                            // remain_y--;
                                            // last_step='y'
                                            if (obstacleSet.has(world.payload.next_x+'|'+world.payload.next_y)) {
                                                pathPredictLevel2();
                                            }else {
                                                setNextStep(world);
                                                world.payload.next_step = [world.payload.next_x, world.payload.next_y];
                                            }
                                        }
                                    }
                                    // |------|
                                    // |      |
                                    // |      |
                                    // |<-----|
                                    if (corner1[1]>corner2[1] && corner1[0]===corner2[0]) {
                                        if (corner2[0]>corner3[0] && corner2[1]===corner3[1]) {
                                            //now forming a rectangle                               
                                            world.payload.next_x=last_correct_x;
                                            world.payload.next_y=last_correct_y+width_y;
                                            // remain_y--;
                                            // last_step='y'
                                            if (obstacleSet.has(world.payload.next_x+'|'+world.payload.next_y)) {
                                                pathPredictLevel2();
                                            }else {
                                                setNextStep(world);
                                                world.payload.next_step = [world.payload.next_x, world.payload.next_y];
                                            }
                                        }
                                    }
                                }else {
                                    console.log('predict left error')
                                }
                            } 
                        // }
                    }else if ( obstacleSet_worm.has(last_correct_x+'|'+(last_correct_y+width_y)) && next_direction==='down' ) {//predict by rectangle down
                        console.log('enter predict down');
                        // debugger;
                        //check only one path left
                        // if (one_path_left.length===1) {
                        //  pathPredictLevel3(one_path_left);
                        // }else {
                            var corner1:Array<number>=markCorner(world,'up',[last_correct_x,last_correct_y],obstacleSet_worm)!; //behind by worm[0]
                            var corner2:any=undefined;
                            var corner2_a:Array<number>=markCorner(world,'left',corner1,obstacleSet_worm)!;
                            var corner2_b:Array<number>=markCorner(world,'right',corner1,obstacleSet_worm)!;
                            if (corner2_b.indexOf(undefined as unknown as number)===-1) {
                                corner2=corner2_b
                            }
                            if (corner2_a.indexOf(undefined as unknown as number)===-1) {
                                corner2=corner2_a
                            }
                            var corner3:Array<number>=markCorner(world,'down',corner2,obstacleSet_worm)!;
                            var predicted_obstacle=[last_correct_x,last_correct_y+width_y]; //front by worm[0], obstacleSet.has((next_x-width_x)+'|'+next_y)
                            if (corner3.indexOf(undefined as unknown as number)>-1) {
                                pathPredictLevel2();
                            }else {
                                if (predicted_obstacle[1]>corner1[1] && predicted_obstacle[0]===corner1[0]) {
                                    // |------|
                                    // |      |
                                    // v      |
                                    // -------|
                                    if (corner1[0]<corner2[0] && corner1[1]===corner2[1]) {
                                        if (corner2[1]<corner3[1] && corner2[0]===corner3[0]) {
                                            //now forming a rectangle                               
                                            world.payload.next_x=last_correct_x-width_x;
                                            world.payload.next_y=last_correct_y;
                                            // remain_x--;
                                            // last_step='x'
                                            if (obstacleSet.has(world.payload.next_x+'|'+world.payload.next_y)) {
                                                pathPredictLevel2();
                                            }else {
                                                setNextStep(world);
                                                world.payload.next_step = [world.payload.next_x, world.payload.next_y];
                                            }
                                        }
                                    }
                                    // |------|
                                    // |      |
                                    // |      v
                                    // |-------
                                    if (corner1[0]>corner2[0] && corner1[1]===corner2[1]) {
                                        if (corner2[1]<corner3[1] && corner2[0]===corner3[0]) {
                                            //now forming a rectangle                               
                                            world.payload.next_x=last_correct_x+width_x;
                                            world.payload.next_y=last_correct_y;
                                            // remain_x--;
                                            // last_step='x'
                                            if (obstacleSet.has(world.payload.next_x+'|'+world.payload.next_y)) {
                                                pathPredictLevel2();
                                            }else {
                                                setNextStep(world);
                                                world.payload.next_step = [world.payload.next_x, world.payload.next_y];
                                            }
                                        }
                                    }
                                }else {
                                    console.log('predict down error')
                                }
                            }
                        // }  
                    }else if ( obstacleSet_worm.has(last_correct_x+'|'+(last_correct_y-width_y)) && next_direction==='up' ) {//predict by rectangle up
                        console.log('enter predict up');
                        // debugger;
                        //check only one path left
                        // if (one_path_left.length===1) {
                        //  pathPredictLevel3(one_path_left);
                        // }else {
                            var corner1:Array<number>=markCorner(world,'down',[last_correct_x,last_correct_y],obstacleSet_worm)!; //behind by worm[0]
                            var corner2:any=undefined;
                            var corner2_a:Array<number>=markCorner(world,'left',corner1,obstacleSet_worm)!;
                            var corner2_b:Array<number>=markCorner(world,'right',corner1,obstacleSet_worm)!;
                            if (corner2_b.indexOf(undefined as unknown as number)===-1) {
                                corner2=corner2_b
                            }
                            if (corner2_a.indexOf(undefined as unknown as number)===-1) {
                                corner2=corner2_a
                            }
                            var corner3:Array<number>=markCorner(world,'up',corner2,obstacleSet_worm)!;
                            var predicted_obstacle=[last_correct_x,last_correct_y-width_y]; //front by worm[0], obstacleSet.has((next_x-width_x)+'|'+next_y)
                            if (corner3.indexOf(undefined as unknown as number)>-1) {
                                pathPredictLevel2();
                            }else {
                                if (predicted_obstacle[1]<corner1[1] && predicted_obstacle[0]===corner1[0]) {
                                    // -------|
                                    // ^      |
                                    // |      |
                                    // |------|
                                    if (corner1[0]<corner2[0] && corner1[1]===corner2[1]) {
                                        if (corner2[1]>corner3[1] && corner2[0]===corner3[0]) {
                                            //now forming a rectangle                               
                                            world.payload.next_x=last_correct_x-width_x;
                                            world.payload.next_y=last_correct_y;
                                            // remain_x--;
                                            // last_step='x'
                                            if (obstacleSet.has(world.payload.next_x+'|'+world.payload.next_y)) {
                                                pathPredictLevel2();
                                            }else {
                                                setNextStep(world);
                                                world.payload.next_step = [world.payload.next_x, world.payload.next_y];
                                            }
                                        }
                                    }
                                    // |-------
                                    // |      ^
                                    // |      |
                                    // |------|
                                    if (corner1[0]>corner2[0] && corner1[1]===corner2[1]) {
                                        if (corner2[1]>corner3[1] && corner2[0]===corner3[0]) {
                                            //now forming a rectangle                               
                                            world.payload.next_x=last_correct_x+width_x;
                                            world.payload.next_y=last_correct_y;
                                            // remain_x--;
                                            // last_step='x'
                                            if (obstacleSet.has(world.payload.next_x+'|'+world.payload.next_y)) {
                                                pathPredictLevel2();
                                            }else {
                                                setNextStep(world);
                                                world.payload.next_step = [world.payload.next_x, world.payload.next_y];
                                            }
                                        }
                                    }
                                }else {
                                    console.log('predict up error')
                                }
                            } 
                        // } 
                    }else {
                        pathPredictLevel2();
                    }
                }
                function checkout(world:any){
                    if (obstacleSet.has(world.payload.next_x+'|'+world.payload.next_y)) {
                        typicallyObstacle();
                    }else {
                        setNextStep(world);
                        world.payload.next_step = [world.payload.next_x, world.payload.next_y];
                    }
                }
                function checkObstacle(current_x:number,current_y:number,set?:Set<unknown|string>):T_Report[]{
                    var right_ward=current_x+width_x;
                    var left_ward=current_x-width_x;
                    var up_ward=current_y-width_y;
                    var down_ward=current_y+width_y;
                    var next_direction=world.payload.next_direction;
                    var obs=set||obstacleSet;
                    
                    var obstacleReport:T_Report[]=[
                        {
                            weight:1,
                            obstacled:obs.has(current_x+'|'+up_ward),
                            nominated: false,
                            name: 'up',
                            level:0,
                            steps:0,
                            child:[],
                            catched: null,
                        },
                        {
                            weight:1,
                            obstacled:obs.has(right_ward+'|'+current_y),
                            nominated: false,
                            name: 'right',
                            level:0,
                            steps:0,
                            child:[],
                            catched: null,
                        },
                        {
                            weight:1,
                            obstacled:obs.has(current_x+'|'+down_ward),
                            nominated: false,
                            name: 'down',
                            level:0,
                            steps:0,
                            child:[],
                            catched: null,
                        },
                        {
                            weight:1,
                            obstacled:obs.has(left_ward+'|'+current_y),
                            nominated: false,
                            name: 'left',
                            level:0,
                            steps:0,
                            child:[],
                            catched: null,
                        },
                    ];    
                    // console.log(obstacleReport)
                    return obstacleReport;
                }
                function setNextStep(world:any){
                    var next_x=world.payload.next_x;
                    var next_y=world.payload.next_y;
                    var last_correct_x=world.payload.last_correct_x;
                    var last_correct_y=world.payload.last_correct_y;
                    var next_direction=world.payload.next_direction;
                    console.log('next:', next_x, next_y)
                    if (next_x>last_correct_x) {
                        world.payload.next_direction = 'right'
                    }
                    if (next_x<last_correct_x) {
                        world.payload.next_direction = 'left'
                    }
                    if (next_y>last_correct_y) {
                        world.payload.next_direction = 'down'
                    }
                    if (next_y<last_correct_y) {
                        world.payload.next_direction = 'up'
                    }
                    world.payload.last_correct_x=next_x;
                    world.payload.last_correct_y=next_y;
                }
            }
        }

        function automaticStart(this:any,e:Event,world:any){
            world.payload.automatic_run=true;
            startMovement(e,world,this);
        }

        function generateBlockToRival(world:any):void{
            if (world.payload.order===0){
                world=duelWorld1
            }else if (world.payload.order===1){
                world=duelWorld0
            }
            var ev=new Event('simple');
            var coordinate:any=generateLonelyWorm( ev,true,world )
            var payload=world.payload;
            var blocks=world.blocks;
            var block_length=blocks.length||0;

            blocks.push({
                type: 'div',
                payload: {
                    offset_x: coordinate.x,
                    offset_y: coordinate.y,
                    size: payload.worm_size,
                    unit: payload.unit,
                    // index: worms_length,
                },
            })
        }

        function generateLonelyWorm(this:any,e:Event,block_form:boolean,world?:any){
            var sets_xy:any=new Set();
            world.worms.forEach((item:any)=>{
                sets_xy.add( item.payload.offset_x+'|'+item.payload.offset_y );             
            })

            var coefficient=2;
            
            var x:Number=new Number();
            var y:Number=new Number();

            var x1:Number=new Number();
            var y1:Number=new Number();

            var width=world.payload.width*2;
            var height=world.payload.height*2;          

            var size_x=Number(world.payload.worm_size.split('x')[0]);
            var size_y=Number(world.payload.worm_size.split('x')[1]);

            var total_x=width/size_x;
            var total_y=height/size_y;
            
            // console.log('sets: ',sets_xy)

            // var max_x=Math.max.apply(this,[...sets_x])+size_x*coefficient;
            // var max_y=Math.max.apply(this,[...sets_y])+size_y*coefficient;
            // var min_x=Math.min.apply(this,[...sets_x])-size_x*coefficient;
            // var min_y=Math.min.apply(this,[...sets_y])-size_y*coefficient;
                
            function calcXY(){

                var _x=Math.round(Math.random()*(total_x-1));
                var _y=Math.round(Math.random()*(total_y-1));
                if ( !sets_xy.has(_x*size_x+'|'+_y*size_y) ) {
                    x=_x*size_x;
                    y=_y*size_y;
                }else {
                    calcXY();
                }
            }
            calcXY();

            

            if (block_form){
                return {
                    x:x,
                    y:y,
                }
            }else {
                console.log('world',world.payload.order,' find new lonely worm: ',x,y);
                world.payload.lonely_worm_x=(x as number);
                world.payload.lonely_worm_y=(y as number);
            }
        }

        function handleClick(this: any,e: InputEvent){

            // console.log(this,e)          
        }

        function changeCreated(this:any,e:any){
            console.log(this)
            console.log('emmit gotted by Game View',e)
        }

        onMounted(function(this:any){

            // changeCreated();
            var that=this;
            document.addEventListener('keyup',function(e:any){
                var index=-1;
                if (e.keyCode===38||e.keyCode===39||e.keyCode===40||e.keyCode===37) {
                    index=1;
                }else if (e.keyCode===87||e.keyCode===68||e.keyCode===83||e.keyCode===65) {
                    index=0;
                }else {
                    return false;
                }
                // console.log(e.keyCode)
                if (!world_orders.value[index]) {
                    return false;
                }
                var payload=world_orders.value[index].world.payload;
                changeMovingDirection(e,payload);                
                
            })

            var that2=getCurrentInstance()
            document.addEventListener('duel-start',function(e:any){
                    startMovement(e,world_orders.value[0].world,that2);
                    startMovement(e,world_orders.value[1].world,that2);
                })
        })

        provide('changeCreated', changeCreated )

        function worldOrder(instruction:string):void{
            var ev=new Event('simple');
            var i=world_orders.value.length;
            if (instruction==='create') {
                world_orders.value.push({
                    index: i,
                    world:{},
                })
                p_half_width1.value[i]=100; //default value to form input initialize
                p_half_height1.value[i]=100; //default value to form input initialize
                p_worm_size1.value[i]=10; //default value to form input initialize
                p_unit1.value[i]='px'; //default value to form input initialize
            }
            if (instruction==='create duel') {
                world_orders.value.push({
                    index: i,
                    world:{},
                })
                p_half_width1.value[i]=200; //default value to form input initialize
                p_half_height1.value[i]=200; //default value to form input initialize
                p_worm_size1.value[i]=10; //default value to form input initialize
                p_unit1.value[i]='px'; //default value to form input initialize   
                establishWorld(ev,0);
                

                i=world_orders.value.length;
                world_orders.value.push({
                    index: i,
                    world:{},
                })
                p_half_width1.value[i]=200; //default value to form input initialize
                p_half_height1.value[i]=200; //default value to form input initialize
                p_worm_size1.value[i]=10; //default value to form input initialize
                p_unit1.value[i]='px'; //default value to form input initialize   
                establishWorld(ev,1);
                world_orders.value[0].world.payload.mode='duel';
                world_orders.value[1].world.payload.mode='duel';
                establishWorm(ev,world_orders.value[0].world,false);
                establishWorm(ev,world_orders.value[0].world,false);
                establishWorm(ev,world_orders.value[1].world,false);
                establishWorm(ev,world_orders.value[1].world,false);

                var ev1=new CustomEvent('duel-prepared',{
                    detail:payload,
                });
                document.dispatchEvent(ev1);
                duelWorld0=world_orders.value[0].world;
                duelWorld1=world_orders.value[1].world;
            }
        }

        return {
            changeCreated,
            establishWorld,
            EstablishWorld,
            // world_established,
            // half_width,
            // half_height,
            // p_half_width,
            // p_half_height,
            // unit,
            // p_unit,
            // game_status,
            // speed,
            automaticStart,

            // worms,
            // worm_size,
            // p_worm_size,
            establishWorm,
            startMovement,
            stopMovement,
            // changeMovingDirection,
            handleClick,

            generateLonelyWorm,
            // lonely_worm_x,
            // lonely_worm_y,
            // lonely_worm_x1,
            // lonely_worm_y1,

            values,
            total,
            worlds,
            worms_data,
            payload,
            // worm_counter,
            worms_data_key,
            world_order,
            world_orders,
            worldOrder,
            p_half_width1,
            p_half_height1,
            p_worm_size1,
            p_unit1,
        }
    },
});
</script>
<template>
    <my-vue-element
        :title="3"
        @change="changeCreated"
    ></my-vue-element>
    <button @click="worldOrder('create')">Create a World order</button>
    <br />
    <button @click="worldOrder('create duel')">Create a Duel World order</button>
    <section class="world-generator-list">
        <WorldGenerator v-for="item in world_orders"
            :order="item.index"
        >
            <h4 class="title">{{ item.index }}</h4>
            <div class="parameter">
                <fieldset>
                    <label>World Width</label>
                    <input v-model="p_half_width1[item.index]" type="number" />
                </fieldset>
                <fieldset>
                    <label>World Height</label>
                    <input v-model="p_half_height1[item.index]" type="number" />
                </fieldset>
                <fieldset>
                    <label>Worm Size</label>
                    <input v-model="p_worm_size1[item.index]" type="number" />
                </fieldset>
                <fieldset>
                    <label>Unit</label>
                    <input v-model="p_unit1[item.index]" type="text" />
                </fieldset>
            </div>
            <div class="controller">
                <button @click="establishWorld($event,item.index)">Establish World</button>
                <button @click="establishWorm($event,item.world,false)">Establish Worm</button>
                <br />
                <button @click="startMovement($event,item.world)">Start Game</button>
                <button @click="stopMovement($event,item.world)">Stop Game</button>
                <br />
                <button @click="generateLonelyWorm($event,false,item.world)">Generate Lonely Worm</button>
                <br />
                <button @click="automaticStart($event,item.world)">Automatic Worm Player Start</button>
            </div>
            <WormsWorld v-if="item.world.active"
                :type="item.world.type"
                :payload="item.world.payload"
                :ref="'world'+item.world.payload.order"          
            >
                <Blocks v-for="block in item.world.blocks"                    
                    :type="block.type"
                    :payload = "block.payload"
                />
                <Worms v-for="worm in item.world.worms"
                    :total="item.world.worms.length"
                    :type="worm.type"
                    :payload = "worm.payload"
                    :timer = "worm.timer"
                    :key = "worm.payload.index+worms_data_key"
                />
            </WormsWorld>
        </WorldGenerator>
    </section>
</template>
<style scoped lang="scss">
h1 {
    margin: 0;
    color: $primary-color;
    font-size: 1rem;
}
fieldset {
    padding:3px;

    > label {

        &:after {
            content: ": ";

        }
    }
}
.worms-world {
    background-color: var(--data-bgcolor);
    width: var(--data-width);
    height: var(--data-height);
    position: relative;

    &:focus {
        outline: 2px dashed #cccccc;
    }

    :deep(span) {
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

    .block-by-rival {
        width: var(--data-width);
        height: var(--data-height);
        background-color: var(--data-bgcolor);
        position: absolute;
        left: var(--data-offset-x);
        top: var(--data-offset-y);
    }

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
}
.world-generator-list {
    display: flex;
    flex-wrap: wrap;

    .world-generator {
        display: flex;
        align-content: space-between;
        padding-top: 1.5rem;
        position: relative;

        > .title {
            line-height: 1.5rem;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            margin: 0;
        }
    }   
}

</style>