import React from "react";
import ReactDOM from "react-dom";
import StopwatchDisplay from "../components/e/StopwatchDisplay";
// import StopwatchHistory from "./StopwatchHistory.jsx";
import * as moment from "moment";

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      running: false,
      currentTimeMs: 0,
      currentTimeSec: 0,
      currentTimeMin: 0,
      currentTimeHour: 0,
      newcurrentTimeSec: 0,
      newcurrentTimeMin: 0,
      newcurrentTimeHour:0,
      startTemp: null

    };
  }

  componentDidMount(){
      console.log(this.props.starttime)
      console.log('new Date()>>',new Date() ,' new Date(this.props.starttime)>',  new Date(this.props.starttime))
      var timeDuration = new Date() - new Date(this.props.starttime);

    var seconds = Math.floor((timeDuration)/1000);
    var minutes = Math.floor(seconds/60);
    var hours = Math.floor(minutes/60);
    var days = Math.floor(hours/24);


    hours = hours-(days*24);
    minutes = minutes-(days*24*60)-(hours*60);
    seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);

    console.log(hours,':', minutes ,':', seconds)
   this.state.newcurrentTimeHour = hours
   this.state.newcurrentTimeMin = minutes
   this.state.newcurrentTimeSec = seconds
   
   this.start()
    setTimeout(() => {
        this.reset()
    }, 5000);
  }
  formatTime = (val, ...rest) => {
    let value = val.toString();
    if (value.length < 2) {
      value = "0" + value;
    }
    if (rest[0] === "ms" && value.length < 3) {
      value = "0" + value;
    }
    return value;
  };

  start = () => {
    if (!this.state.running) {
      this.setState({ running: true });
      this.watch = setInterval(() => this.pace(), 10);
    }
  };

  stop = () => {
    this.setState({ running: false });
    clearInterval(this.watch);
  };

  pace = () => {
    this.setState({ currentTimeMs: this.state.currentTimeMs + 10 });
    if (this.state.currentTimeMs >= 1000) {
      this.setState({ currentTimeSec: this.state.currentTimeSec + 1 });
      this.setState({ currentTimeMs: 0 });
    }
    if (this.state.currentTimeSec >= 60) {
      this.setState({ currentTimeMin: this.state.currentTimeMin + 1 });
      this.setState({ currentTimeSec: 0 });
    }
    if (this.state.currentTimeMin >= 60) {
      this.setState({ currentTimeHour: this.state.currentTimeHour + 1 });
      this.setState({ currentTimeMin: 0 });
    }
  };

  reset = () => {
    this.setState({
      currentTimeHour: this.state.newcurrentTimeHour,
      currentTimeMs: 0,
      currentTimeSec: this.state.newcurrentTimeSec,
      currentTimeMin: this.state.newcurrentTimeMin
    });
  };

  render() {
    return (
      <div>
      <div className={"timerDiv"}>
        <StopwatchDisplay
          ref="display"
          {...this.state}
          formatTime={this.formatTime}
        />
      </div>
      </div>
    );
  }
}

export default Timer;





// import React from 'react';
// import { useEffect } from 'react';
// import { useStopwatch } from 'react-timer-hook';
// import * as moment from 'moment'

// export default function TimerUI(props) {
//   let {
//     seconds,
//     minutes,
//     hours,
//     days,
//     isRunning,
//     start,
//     pause,
//     reset,
//   } = useStopwatch({ autoStart: true });
  
//   useEffect(()=>{
//     //  Cookies.set('name', 1, { expires: 7 })
//     // window.sessionStorage.setItem("days", days);
//     // window.sessionStorage.setItem("hours", hours);
//     // window.sessionStorage.setItem("minutes", minutes);
//     // window.sessionStorage.setItem("seconds", seconds);
//     // setCookie('days', days);
//     // setCookie('hours', hours);
//     // setCookie('minutes', minutes);
//     // setCookie('seconds', seconds);
//       // if( getCookie('seconds')){
//       //   console.log('asdasd')
//       //   seconds = getCookie('seconds', seconds);
//       //   minutes = window.sessionStorage.getItem('minutes')
//       //   hours = window.sessionStorage.getItem('hours')
//       //   days = window.sessionStorage.getItem('days')
//       //   console.log('asjhdgajhlsgdjhasgd')

//       // }
//       console.log(props.starttime)
//       let starttimeHours = moment(props.starttime).hour()
//       let starttimeMinutes = moment(props.starttime).minute()
//       let starttimeSeconds = moment(props.starttime).second()
//       stopwatchOffset = new Date();

//       console.log('in timer', starttimeHours,starttimeMinutes,starttimeSeconds)
//   })
//   return (
//     <div style={{textAlign: 'center'}}>
//       <div style={{fontSize: '42px'}}>
//         <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
//       </div>
//       <br/>
//       {/* <p>{isRunning ? 'Running' : 'Not running'}</p> */}
//       <span style={{display:'flex', flexDirection:'row', justifyContent:'center',fontSize:'18px'}}>cost = &nbsp;<strong>$ {(seconds * 0.1).toFixed(1)}</strong></span>
//       {/* <button onClick={start}>Start</button>
//       <button onClick={pause}>Pause</button>
//       <button onClick={reset}>Reset</button> */}
//     </div>
//   );
// }