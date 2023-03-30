import React from 'react';

class StopwatchDisplay extends React.Component {
  render() {
    return (
      <>
      <div className={'stopwatch__display'}>
        <span>
          {this.props.formatTime(this.props.currentTimeHour)}:
          {this.props.formatTime(this.props.currentTimeMin)}:
          {this.props.formatTime(this.props.currentTimeSec)}
          {/* {this.props.formatTime(this.props.currentTimeMs, 'ms')} */}
        </span>
        <span style={{fontSize: '14px'}}>&nbsp;Min</span>
      </div>
      </>
    );
  }
}

export default StopwatchDisplay;
