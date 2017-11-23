import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar';
// import events from './events';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css'

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

class Basic extends Component {
  render(){
    const d = new Date();
    d.setFullYear(1337, 0, 0)
    // d.setDate(d.getDate() + this.props.currentTime);

    

    return (
      <BigCalendar
        views={allViews}
        step={60}
        events={this.props.events}
        // {...this.props}
        // date={d}
        onNavigate={()=>console.log("Navigated")}
        defaultDate={d}
      />
    )
  }
}

export default Basic;
