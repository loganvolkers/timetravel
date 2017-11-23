
/**
 * Projects a repeating event across a given timeframe.
 * 
 */
export function projectEvent({event, timeframe}){
    if(event.start > timeframe.end){
        return []; // "No need to project future repeating events"
    }
    const frames = [];
    for (let i = timeframe.start; i < timeframe.end; i++) { 
    
      if( i >= event.start && (event.end == null || i < event.end)){
        frames.push({time:i,id:event.id})
      }
    }
    return frames;
}


/**
 * Projects a schedule and all events in the schedule across a given timeframe
 */
export function projectSchedule({schedule, timeframe}){
    
    let allEvents = [...schedule.oneoff];
    
    const repeaters = schedule.repeat.reduce((sum,event)=>pushArray(sum, projectEvent({event,timeframe})), []);
    allEvents = pushArray(allEvents, repeaters);
    
    const projected = {
        ...schedule,
        events: allEvents
    }
    
    return projected;
}

/**
 * Ticks forward in time.
 * 
 * Looks at the current schedule, the current time, creates and runs tasks, then returns a new schedule.
 * 
 */
export function step({schedule, functions, currentTime}){
    
    const {events, oneoff} = schedule;
    
    const newEvents = events.reduce((sum, value) => {
        if(value.time === currentTime){
            const eventfn = functions[value.id];
            if(eventfn){
                const next = eventfn(value.time);
                if(next){
                    sum.push(next)
                }
            }
        }
        return sum;
    }, [])
    
    const next = {
        ...schedule,
        time: schedule.time+1,
        oneoff:[
            ...oneoff,
            ...newEvents
        ],
        events:[
            ...events,
            ...newEvents            
        ]
    }
    return next;
}


function pushArray(arr, arr2) {
    arr.push.apply(arr, arr2);
    return arr;
}