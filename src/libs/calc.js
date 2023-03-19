var x=5;
var y=2;
var target_x=0;
var target_y=5;
var map_x=6;
var map_y=6;
var width_x=1;
var width_y=1;
var warning=false;
var next_x=x;
var next_y=y;
var remain_x=Math.abs(x-target_x)/width_x;
var remain_y=Math.abs(y-target_y)/width_y;
var last_step='y';
var next_direction='up';
var last_correct_x=x;
var last_correct_y=y;

var obstacleSet=new Set();
for (var xi=0,yi=-1;xi<map_x;xi+=width_x) {
    obstacleSet.add(xi+'|'+yi);
}
for (var xi=-1,yi=0;yi<map_y;yi+=width_y) {
    obstacleSet.add(xi+'|'+yi)
}
for (var xi=0,yi=map_y;xi<map_x;xi+=width_x) {
    obstacleSet.add(xi+'|'+yi);
}
for (var xi=map_x,yi=0;yi<map_y;yi+=width_y) {
    obstacleSet.add(xi+'|'+yi)
}
obstacleSet.add('1|1');
obstacleSet.add('1|2');
obstacleSet.add('1|3');
obstacleSet.add('1|4');

obstacleSet.add('2|4');
obstacleSet.add('3|4');
obstacleSet.add('4|4');
obstacleSet.add('5|4');

obstacleSet.add('5|3');

automaticStratage();

function automaticStratageWithObstacle(fix_x,fix_y){    
    if (warning) {
        return false;
    }
    x=last_correct_x;
    y=last_correct_y;
    next_x=x;
    next_y=y;
    remain_x=Math.abs(x-target_x)/width_x;
    remain_y=Math.abs(y-target_y)/width_y;
    // console.log('start_x: ',x,' start_y: ',y);
    // console.log('remain_x: ',remain_x,' remain_y: ',remain_y);
    if (fix_x) {
        last_step='x';
        
        // console.log('horizontal has obstacle. fixing... last_step reset to "x"');   
        if (remain_y===0) {
            remain_y++;
        }
        // console.log('Set remain_y + 1, try to move to otherward.') 
    }
    if (fix_y) {
        last_step='y';
        if (remain_x===0) {
            remain_x++;
        }
        // console.log('vertical has obstacle. fixing... last_step reset to "y"');    
    }
    
    automaticStratage(true);
}
function checkObstacle(current_x,current_y){
    if (warning) {
        return false;
    }
    var right_ward=current_x+width_x;
    var left_ward=current_x-width_x;
    var up_ward=current_y-width_y;
    var down_ward=current_y+width_y;

    var obstacleReport=[
            {
                weight:1,
                obstacled:obstacleSet.has(current_x+'|'+up_ward) || next_direction==='down',
                nominated: false,
            },
            {
                weight:1,
                obstacled:obstacleSet.has(right_ward+'|'+current_y) || next_direction==='left',
                nominated: false,
            },
            {
                weight:1,
                obstacled:obstacleSet.has(current_x+'|'+down_ward) || next_direction==='up',
                nominated: false,
            },
            {
                weight:1,
                obstacled:obstacleSet.has(left_ward+'|'+current_y) || next_direction==='right',
                nominated: false,
            },
    ];    

    return obstacleReport;
}
function setNextStep(){
    if (next_x>last_correct_x) {
        next_direction = 'right'
    }
    if (next_x<last_correct_x) {
        next_direction = 'left'
    }
    if (next_y>last_correct_y) {
        next_direction = 'down'
    }
    if (next_y<last_correct_y) {
        next_direction = 'up'
    }
    last_correct_x=next_x;
    last_correct_y=next_y;
    obstacleSet.add(last_correct_x +'|' + last_correct_y);
    
    remain_x=Math.abs(next_x-target_x)/width_x;
    remain_y=Math.abs(next_y-target_y)/width_y;
    console.log('Correct! ', next_x, next_y, ' Direction: ',next_direction);
}
function automaticStratage(fix){      

    var obstacle_from_up=null;
    var obstacle_from_right=null;
    var obstacle_from_down=null;
    var obstacle_from_left=null;
    if (warning) {
        return false;
    }
    if (fix) {
        debugger;
        var obstacle_report=checkObstacle(last_correct_x,last_correct_y)
        console.log(obstacle_report);
        obstacleSet.forEach(item=>{
            if (!(Number(item.split('|')[0])>=map_x) && !(Number(item.split('|')[0])<0) && Number(item.split('|')[0])===last_correct_x) {
                if (!(Number(item.split('|')[1])>=map_y) && !(Number(item.split('|')[1])<0) && Number(item.split('|')[1])>last_correct_y) {
                    console.log('down:',item)
                    obstacle_from_down=true;
                }
                if (!(Number(item.split('|')[1])>=map_y) && !(Number(item.split('|')[1])<0) && Number(item.split('|')[1])<last_correct_y) {
                    console.log('up:',item)
                    obstacle_from_up=true;
                }
            }
            if (!(Number(item.split('|')[1])>=map_y) && !(Number(item.split('|')[1])<0) && Number(item.split('|')[1])===last_correct_y) {
                if (!(Number(item.split('|')[0])>=map_x) && !(Number(item.split('|')[0])<0) && Number(item.split('|')[0])>last_correct_x) {
                    console.log('right:',item)
                    obstacle_from_right=true;
                }
                if (!(Number(item.split('|')[0])>=map_x) && !(Number(item.split('|')[0])<0) && Number(item.split('|')[0])<last_correct_x) {
                    console.log('left:',item)
                    obstacle_from_left=true;
                }
            }
        });
        if (last_correct_x>target_x) {
            obstacle_report[1].weight--;
            obstacle_report[3].weight++;
            if (obstacle_from_left) {
                obstacle_report[3].weight--;
                obstacle_report[1].weight++;
            }
            else if (obstacle_from_right) {
                obstacle_report[1].weight--;
                obstacle_report[3].weight++;
            }
        }
        if (last_correct_y<target_y) {
            obstacle_report[0].weight--;
            obstacle_report[2].weight++;
            if (obstacle_from_up) {
                obstacle_report[0].weight--;
                obstacle_report[2].weight++;
            }
            if (obstacle_from_down) {
                obstacle_report[2].weight--;
                obstacle_report[0].weight++;
            }
        }
        var weights=obstacle_report.map((item) => {
            item.weight=item.obstacled
                                ?item.weight-1
                                :item.weight+1;
            return item.weight;
        });
        var nominated_index=weights.indexOf(Math.max(...weights));
        obstacle_report[nominated_index].nominated=true;

        if (obstacle_report[0].obstacled!==true && obstacle_report[0].nominated) {//up
            next_y=last_correct_y-width_y;
        }
        else if (obstacle_report[1].obstacled!==true && obstacle_report[1].nominated) {//right
            next_x=last_correct_x+width_x;
        }
        else if (obstacle_report[2].obstacled!==true && obstacle_report[2].nominated) {//down
            next_y=last_correct_y+width_y;
        }
        else if (obstacle_report[3].obstacled!==true && obstacle_report[3].nominated) {//left
            next_x=last_correct_x-width_x;
        }else {
            warning=true;            
        }

        setNextStep();        

        if (remain_x+remain_y>0) {        
            automaticStratage();
        }

    }else {
        if (remain_x+remain_y>0) {
            if (remain_y>0 && last_step==='x') {
                target_y>=last_correct_y
                        ?next_y=last_correct_y+width_y
                        :next_y=last_correct_y-width_y;
                remain_y--;
                last_step='y';
            }else if (remain_x>0 && last_step==='y') {
                target_x>=last_correct_x
                        ?next_x=last_correct_x+width_x
                        :next_x=last_correct_x-width_x;
                remain_x--;
                last_step='x';
            }else if (remain_y===0 && last_step==='x') {
                target_x>x
                        ?next_x=next_x+width_x
                        :next_x=next_x-width_x;
                remain_x--;
                last_step='x';
            }else if (remain_x===0 && last_step==='y'){
                target_y>y
                        ?next_y=next_y+width_y
                        :next_y=next_y-width_y;
                remain_y--;
                last_step='y';
            }
        }
    }
    
    if (next_x===target_x && next_y===target_y) {
        setNextStep();
    }
    else if (obstacleSet.has(next_x+'|'+next_y)) {
        console.log('Next step '+next_x+'|'+next_y+' has obstacle, stratage failure. Reset stratage with fix instruction...')
        if (last_step==='x') {
            automaticStratageWithObstacle(true,false);
        }else {
            automaticStratageWithObstacle(false,true);
        }
    }else if (next_x>last_correct_x && obstacleSet.has((next_x+width_x)+'|'+next_y)) {//predict by rectangle
    //     var corner1="5|2";
    //     var corner2="5|4";
    //     var corner3="1|4";
    //     var predicted_obstacle="1|2";
    // }    
    }else if ( last_step==='y' && (obstacleSet.has((last_correct_x-width_x)+'|'+last_correct_y)) ) {//predict by rectangle direction left
        debugger;
        var corner1=[5,2]; //behind by worm[0]
        var corner2=[5,4];
        var corner3=[1,4];
        var predicted_obstacle=[1,2]; //front by worm[0], obstacleSet.has((next_x-width_x)+'|'+next_y)

        if (predicted_obstacle[0]<corner1[0] && predicted_obstacle[1]===corner1[1]) {
            if (corner1[1]<corner2[1] && corner1[0]===corner2[0]) {
                if (corner2[0]>corner3[0] && corner2[1]===corner3[1]) {
                    //now forming a rectangle 
                    
                    next_x=last_correct_x;
                    next_y=last_correct_y-width_y;
                    remain_y--;
                    last_step='y'
                    if (obstacleSet.has(next_x+'|'+next_y)) {
                        console.log('Next step '+next_x+'|'+next_y+' has obstacle, stratage failure. Reset stratage with fix instruction...')
                        if (last_step==='x') {
                            automaticStratageWithObstacle(true,false);
                        }else {
                            automaticStratageWithObstacle(false,true);
                        }
                    }else {
                        if (next_x>last_correct_x) {
                            next_direction = 'right'
                        }
                        if (next_x<last_correct_x) {
                            next_direction = 'left'
                        }
                        if (next_y>last_correct_y) {
                            next_direction = 'down'
                        }
                        if (next_y<last_correct_y) {
                            next_direction = 'up'
                        }

                        last_correct_x=next_x;
                        last_correct_y=next_y;
                        obstacleSet.add(last_correct_x +'|' + last_correct_y);
                        
                        console.log('Correct! ', next_x, next_y, ' Direction: ',next_direction);
                    }
                }
            }
        } 
    // }else if (next_y>last_correct_y && obstacleSet.has(next_x+'|'+(next_y+width_y))) {//predict by rectangle
    //     
    // }else if (next_y<last_correct_y && obstacleSet.has(next_x+'|'+(next_y-width_y))) {//predict by rectangle
        
    }else {       
        if (next_x>last_correct_x) {
            next_direction = 'right'
        }
        if (next_x<last_correct_x) {
            next_direction = 'left'
        }
        if (next_y>last_correct_y) {
            next_direction = 'down'
        }
        if (next_y<last_correct_y) {
            next_direction = 'up'
        }
        last_correct_x=next_x;
        last_correct_y=next_y;
        obstacleSet.add(last_correct_x +'|' + last_correct_y);
        
        remain_x=Math.abs(next_x-target_x)/width_x;
        remain_y=Math.abs(next_y-target_y)/width_y;
        console.log('Correct! ', next_x, next_y, ' Direction: ',next_direction);

    }
    
    if (remain_x+remain_y>0) {        
        automaticStratage();
    }
    
}