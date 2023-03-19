var obj=[
    {
        name:'up',
        level:1,
        step:1,
        child:[
            {
                level:2,
                name:'right',
                step:2,
                child:[
                    {
                        level:3,
                        step:1,
                        catched:false
                    }
                ]
            },
            {
                level:2,
                name:'left',
                step: 4,
                child:[
                    {
                        level:3,
                        step:1,
                        catched:true
                    }
                ]
            }
        ]
    },
    {
        name:'down',
        level:1,
        step:2,
        child:[
            {
                level:2,
                step:4,
                catched:true
            }
        ]
    }
]

var first=null;
function search(obj){
    debugger
    if (!first) {
        first=obj.name
    }
    if ('level' in obj) {
        if (obj.level===1) {
            first=obj.name
        }
    }
    if (obj.catched===true ){
        console.log(first,'level',obj.level)    
    }else {
        // console.log('level'+obj.level,obj.step)
        if (obj.child) {
            obj.child.forEach(item=>{
                search(item)
            })
        }        
    }
}

obj.forEach(item=>{
    search(item)   
})