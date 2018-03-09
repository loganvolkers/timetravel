import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {step, projectSchedule} from './timemachine';
import {filter, last} from 'lodash';
import JSONArea from './jsonarea';
import Calendar from './Calendar';


const functions = {
  tomorrow(time){
    return {
      time:time+2,
      id:"tomorrow"
    }
  },
  ping(time){
    return {
      time:time+2,
      id:"pong"
    }    
  },
  pong(time){
    return {
      time:time+2,
      id:"ping"
    }    
  },
  queueEmail3(time){
    return {
      time:time+3,
      id:"email"
    }
  },
  nesty4(time){
    return {
      time:time+4,
      id:"queueEmail3"
    }
  },
  repeater(time){
    return {
      time:time+1,
      id:"email"
    }
  }
}

class App extends Component {
  
  constructor(){
    super();
    this.step = this.step.bind(this);
    this.unstep = this.unstep.bind(this);
    this.forward = this.forward.bind(this);
    this.back = this.back.bind(this);
    this.toggleUnit = this.toggleUnit.bind(this);
    this.toggleTicking = this.toggleTicking.bind(this);    
  
    this.state = {
      time: 1,
      timeframe: {
        start: 1,
        end: 10
      },
      schedules: [{
        time: 1,
        oneoff:[
          {
            time:2,
            id:"tomorrow"
          },
          // {
          //   time:1,
          //   id:"nesty4"
          // },
          // {
          //   time:4,
          //   id:"queueEmail3"
          // }
        ],
        repeat:[
          {
            start: 3,
            end: 10,
            every: 2,
            id: "repeater"
          }
        ]
      }],
      unit: "days",
      ticking: false
    }
    
    setInterval(()=> this.tick(), 200);
  }
  
  tick(){
    if(this.state.ticking){
      this.step();
    } 
  }
  
  toggleTicking(){
    let {ticking} = this.state;
    this.setState({ticking:!ticking});
  }
  
  /**
   * 
   * Key	Code
   * left arrow	37
   * up arrow	38
   * right arrow	39
   * down arrow	40
  */
  _handleKeyDown (event) {
    if(event.target.type === 'textarea' || event.target.type === 'input'){
      return;
    }
    switch( event.keyCode ) {
        case 37:
            this.back();
            event.preventDefault();
            break;
        case 38:
            this.unstep();
            event.preventDefault();
            break;
        case 39:
            this.forward();
            event.preventDefault();
            break;
        case 40:
            this.step();
            event.preventDefault();
            break;
        default: 
            break;
    }
  }
    
    
  componentWillMount(){
      document.addEventListener("keydown", this._handleKeyDown.bind(this));
  }
    
  
  step(){
    const prev = projectSchedule({schedule:last(this.state.schedules), timeframe:this.state.timeframe});
    const time = this.state.time;
    const nextSched = step({schedule:prev, currentTime:time, functions});
    
    const schedules = [...this.state.schedules, nextSched];
    
    this.setState({schedules, time: time+1 })
  }
  toggleUnit(){
    let unit;
    if(this.state.unit === "days"){
      unit = "hours";
    }else{
      unit = "days";
    }
    this.setState({unit})
  }
  startChange(newStart){
    this.setState({time:newStart.time, schedules:[newStart]})
  }
  unstep(){
    if(this.state.schedules.length <=1){
      return
    }
    const [...schedules] = this.state.schedules;
    schedules.pop();
    this.setState({schedules, time: this.state.time-1 })    
  }
  forward(){
    const timeframe = {start:this.state.timeframe.start+1, end:this.state.timeframe.end+1};
    this.setState({timeframe})    
  }
  
  back(){
    if(this.state.timeframe.start <=1){
      return
    }
    const timeframe = {start:this.state.timeframe.start-1, end:this.state.timeframe.end-1};
    this.setState({timeframe})    
  }
  

  render() {
    const latest = last(this.state.schedules);
    // const extraScheds = Math.max(this.state.schedules.length - 5, 1);
    const displayScheds = this.state.schedules.slice(Math.max(this.state.schedules.length - 5, 1));
    const dsplayEvents = latest.oneoff.slice(Math.max(latest.oneoff.length - 5, 1)).reverse();
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Time Machine</h1>
        </header>
        <div style={{display:"flex"}}>
          <div style={{flex: "2 2 0", margin: 10}}>
            <h2>Current timewarp: <small>{this.state.time}</small></h2> <br/>
            <button onClick={this.step}>Step</button>
            <button onClick={this.unstep}>UnStep</button>
            <button onClick={this.toggleTicking}>{this.state.ticking ? "Ticking" : "Paused"}</button>
            <button onClick={this.toggleUnit}>{this.state.unit}</button>
            
            <JSONArea value={this.state.schedules[0]} onChange={this.startChange.bind(this)} style={{width:"100%", height: 400}} />
            
          </div><div style={{flex: "4 4 0", margin: 10}}>
           <Calendar events={scheduleToBigCalendar(latest, this.state.time, this.state.unit)} />
           <h2>Current Schedule <button onClick={this.back}>←</button> <button onClick={this.forward}>→</button> <small>Time: {this.state.timeframe.start} to {this.state.timeframe.end}</small></h2>
           <Schedule schedule={latest} timeframe={this.state.timeframe} currentTime={this.state.time} />
         <h2>Schedules</h2>
         {displayScheds.map((s,i)=><Schedule key={i} schedule={s} timeframe={this.state.timeframe} currentTime={this.state.time} />).reverse()}
          </div><div style={{flex: "1 1 0", margin: 10}}>
         <h2>Current Events <small>({latest.oneoff.length})</small></h2>
         <div>
          {dsplayEvents.map((e, i)=><div style={{borderTop:"1px solid #CCC"}} key={i}>Time: {e.time}<br/>Id: {e.id}</div>)}
         </div>
        </div></div>
      </div>
    );
  }
}

const addHours = function(d, h) {    
   d.setTime(d.getTime() + (h*60*60*1000)); 
   return d;   
}

function scheduleToBigCalendar(schedule, currentTime, unit = "days"){
    let projected = projectSchedule({ schedule, timeframe:{ start: 0, end: 91} });

    let start = new Date();
    start.setFullYear(1337, 0, 0)

    function create(id, time){
      let start = new Date();
      start.setFullYear(1337, 0, 0)
      let allDay = false;
      if(unit === "hours"){
        start = addHours(start, time);
      }else if(unit === "days"){
        start.setDate(start.getDate() + time);
        allDay = true;
      }
      let end = new Date();
      end.setTime(start.getTime() + 1);
      return {
        'title': id,
        start,
        end,
        allDay
      }      
    }

    const bigCalEvents = projected.events.map((e)=>{
      return create(e.id, e.time);
    })

    const now = create("NOW", currentTime);

    console.log("BigCal", bigCalEvents);
    
    return [now, ...bigCalEvents];
}


class Schedule extends Component {
  render(){
    let projected = projectSchedule({ schedule:this.props.schedule, timeframe:this.props.timeframe });
    
    const frames = [];
    for (let i = this.props.timeframe.start; i < this.props.timeframe.end; i++) { 
      var found = filter(projected.events, { 'time': i });
      if(found){
        frames.push({time:i,events:found})
      }else{
        frames.push({time:i});
      }
    }
    return (<div style={{display:"flex", height: 50}}>
      {frames.map((f, i)=>{
        const isToday = this.props.currentTime === f.time;
        const bg = isToday? "yellow" : "white";
        return <div key={i} style={{flex: "1 1 0", background: bg, margin: 3, padding: 3, border: "1px solid #CCC", overflow:"auto"}}>{f.events?f.events.map((e,j)=><div key={j}>{e.id}</div>):"_"}</div>}
      
      )}
      
      <div style={{flexGrow: "2 2 0"}}>
        Time: {projected.time},
        Events: {projected.events.length}
      </div>
    </div>)
  }
}

export default App;
