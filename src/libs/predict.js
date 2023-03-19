var obs=new Set()

var x=3,y=3;
var tx=1,ty=1;
var o=[
    {
        name:'right',
        level:0,
        steps:0,
        child:[],
        catched: null,
    },
    {
        name:'up',
        level:0,
        steps:0,
        child:[],
        catched: null,
    },
    {
        name:'down',
        level:0,
        steps:0,
        child:[],
        catched: null,
    }
]
var captured=false;
var first=null;
var result=[];
var obstacled_path=null;
o.forEach((item,index)=>{
    obs.clear();
    obs.add('-1|0')
    obs.add('-1|1')
    obs.add('-1|2')
    obs.add('-1|3')
    obs.add('-1|4')
    obs.add('5|0')
    obs.add('5|1')
    obs.add('5|2')
    obs.add('5|3')
    obs.add('5|4')
    obs.add('0|-1')
    obs.add('1|-1')
    obs.add('2|-1')
    obs.add('3|-1')
    obs.add('4|-1')
    obs.add('0|5')
    obs.add('1|5')
    obs.add('2|5')
    obs.add('3|5')
    obs.add('4|5')

    obs.add('1|3')
    obs.add('2|3')
    obs.add('3|3')
    result[index]=checkObstacleNext(item,x,y);
})

result.forEach(item=>{
    search(item)   
})
function search(obj){    
    // debugger;
    if (!first) {
        first=obj.name
    }
    if ('level' in obj) {
        if (obj.level===0) {
            first=obj.name   
        }
    }
    if (obj.catched===true ){
        console.log(first,'level',obj.level)    
    }else {        
        if (obj.child) {
            obj.child.forEach(item=>{
                search(item)
            })
        }        
    }
}
function checkObstacle(current_x,current_y){
    var right_ward=current_x+1;
    var left_ward=current_x-1;
    var up_ward=current_y-1;
    var down_ward=current_y+1;
    var next_direction=null;
    
    var obstacleReport=[
        {
            weight:1,
            obstacled:obs.has(current_x+'|'+up_ward) || next_direction==='down',
            nominated: false,
            name: 'up',
        },
        {
            weight:1,
            obstacled:obs.has(right_ward+'|'+current_y) || next_direction==='left',
            nominated: false,
            name: 'right',
        },
        {
            weight:1,
            obstacled:obs.has(current_x+'|'+down_ward) || next_direction==='up',
            nominated: false,
            name: 'down',
        },
        {
            weight:1,
            obstacled:obs.has(left_ward+'|'+current_y) || next_direction==='right',
            nominated: false,
            name: 'left',
        },
    ];    
    //console.log(obstacleReport)
    return obstacleReport;
}
function checkObstacleNext(obj,scout_x,scout_y,child,changing){
    var level=child
                ?obj.level
                :obj.level+1;
    var child_way=null;
    var change_way=null;
    var direction=obj.name;
    if (direction==='up'){
        scout_y=scout_y-1;
    }
    if (direction==='right'){
        scout_x=scout_x+1;
    }
    if (direction==='down'){
        scout_y=scout_y+1;
    }
    if (direction==='left'){
        scout_x=scout_x-1;
    }
    obstacled_path=obs.has(scout_x+'|'+scout_y);
    debugger;
    if (!obstacled_path) {
        if (scout_x===tx && scout_y===ty) {
            obj.steps++;
            obj.catched=true;
            // captured=true;
        }else {
            if (scout_x===tx) {
                if (scout_y>ty) {
                    change_way='up';
                }else {
                    change_way='down';
                }
            }
            if (scout_y===ty) {
                if (scout_x>tx) {
                    change_way='left';
                }else {
                    change_way='right';
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
                //console.log(obs);
                if (!captured) {
                    checkObstacleNext(obj,scout_x,scout_y);
                }
            }
        }
    }else if (obstacled_path) {//level2 scout
        if (direction==='up'){
            scout_y=scout_y+1;
        }
        if (direction==='right'){
            scout_x=scout_x-1;
        }
        if (direction==='down'){
            scout_y=scout_y-1;
        }
        if (direction==='left'){
            scout_x=scout_x+1;
        }
        child_way=checkObstacle(scout_x,scout_y).filter(item=>{
                                return !item.obstacled
                            });
        var child_way_length=child_way.length
        if (child_way_length>0 && level<3 && !captured) {
            child_way.forEach(item=>{
                obj.child.push( checkObstacleNext({
                    name:item.name,
                    level:level,
                    steps:0,
                    child:[],
                    catched:null,
                },scout_x,scout_y,true) )
            })
        }
    }
    // result=obj;
    return obj;
}