function changeMovingDirection(e:KeyboardEvent,payload:any,p_direction?:string){
    if (!payload.game_status) {
        return false;
    }
    if (payload.directionChanged) {//prevent direction invoke move
        return false;
    }
    // console.log(e)
    var first_worm_direction=payload.first_worm_direction;
    var directionCode:number = e.keyCode;
    var direction=p_direction || '';

    checkDirection();
    if (
        direction===first_worm_direction || 
        (direction==='up'&&first_worm_direction==='down') ||
        (direction==='down'&&first_worm_direction==='up') ||
        (direction==='left'&&first_worm_direction==='right') ||
        (direction==='right'&&first_worm_direction==='left') 
    ) {
        return false;
    }//prevent eat self by revert way
    switch(directionCode){
        case 38://up
        case 87:
            direction='up';
            payload.first_worm_direction='up';
            break;
        case 39://right
        case 68:                
            payload.first_worm_direction='right';
            break;
        case 40://down
        case 83:    
            payload.first_worm_direction='down';
            break;
        case 37://left
        case 65:    
            payload.first_worm_direction='left';
            break;
        default:
            break;
    }
    payload.directionChanged=true;
    // console.log('WARNING: directionChanged.')
    function checkDirection(){
        switch(p_direction || directionCode){
            case 38://up
            case 87:
                direction='up';
                break;
            case 39://right
            case 68:    
                direction='right';
                break;
            case 40://down
            case 83:
                direction='down';
                break;
            case 37://left
            case 65:
                direction='left';
                break;
            default:
                break;
        }               
    }
}
export {
    changeMovingDirection
}