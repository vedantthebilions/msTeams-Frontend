import React, { Component } from "react";
import axios from "axios";
import { app } from "@microsoft/teams-js";
import * as moment from "moment";
import MediaQuery from "react-responsive";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import StopwatchDisplay from "../e/StopwatchDisplay";
import CardHeader from "@mui/material/CardHeader";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import SearchBar from "material-ui-search-bar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";


class InMeetUI extends Component {
  state = {
    currentTime: "",
    metingDetails: {},
    meetingIdForGraphApi: "",
    cost: 0.1,
    chatId: null,
    memberId: null,
    dbStartTime: null,
    accessToken: "",
    meetingId: "",
    meetingDetails: [],
    meetingContext: "",
    currentUser: [],
    counter: 0,
    running: false,
    currentTimeMs: 0,
    currentTimeSec: 0,
    currentTimeMin: 0,
    currentTimeHour: 0,
    newcurrentTimeSec: 0,
    newcurrentTimeMin: 0,
    newcurrentTimeHour: 0,
    startTemp: null,
    meetingCost: null,
    totalAmount: 0,
    totaltimer: 0,
    flag: 0,
    featureNotActive: true,
    featureNotActiveMessage: "Organizer has not activated feature for this meeting.",
    showAttendees: false,
    searched: "",
    rows: [],
  };

  componentDidMount() {
    app.initialize().then(() => {
      // get AuthToken
      // Get the user context from Teams and set it in the state
      app.getContext().then((context) => {
        this.setState({
          meetingContext: context,
          meetingId: context.meeting.id,
          chatId: context.chat.id,
          currentUser: context.user,
        });
        if (this.state.counter === 0) {
          let numberdata = 1;
          this.setState({
            counter: numberdata,
            flag: 1,
          });
          this.addOrganizerInMeeting();
        }
        
      });
    });
  }

  addOrganizerInMeeting = async () => {
    let accessToken = localStorage.getItem("accessToken");

    const authHeader = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    await axios
      .get(`http://localhost:3001/tabApi/get-meeting/${this.state.chatId}`)
      .then((result) => {
        if (result.data.meetingMembers) {
          if (
            result.data.meeting[0]["recordPermission"] === false ||
            result.data.meeting[0]["recordPermission"] === null
          ) {
          console.log(result.data.meeting[0])
            this.setState({
              featureNotActiveMessage:
                "Organizer has not activated feature for this meeting.",
              featureNotActive: true,
            });
          } else {
            this.setState({
              featureNotActiveMessage: "",
              featureNotActive: false,
            });

            this.getMemberDetails();
          }
        }
      });

    await axios
      .get(
        `https://graph.microsoft.com/beta/chats/${this.state.chatId}`,
        authHeader
      )
      .then(async (chat) => {
        axios
          .get(
            `https://graph.microsoft.com/v1.0/me/onlineMeetings?$filter=JoinWebUrl%20eq%20'${chat.data.onlineMeetingInfo?.joinWebUrl}'`,
            authHeader
          )
          .then(async (response) => {
            let meetingDetails = response.data?.value[0];

            let organizer =
              meetingDetails.participants["organizer"]["identity"]["user"];

            let body = {
              // memberId: membersAdded[cnt].id,
              memberId: organizer.id,
              startTime: new Date(), //2023-01-05T05:56:44.046Z
              chatId: this.state.chatId,
              name: organizer.displayName,
            };
            // console.log('membersAdded=>', membersAdded[cnt]);

            const res = await axios.post(
              `http://localhost:3001/tabApi/add-meeting-organizer`,
              body
            );
            this.getMemberDetails();
          });
      });

      console.log('this.props.metingDetails[0]>',this.props.metingDetails[0])
      if (this.props.metingDetails[0]?.participants["attendees"].length < 10) {
        this.props.metingDetails[0]?.participants["attendees"].push(
          {
            identity: null,
            role: "attendee",
            upn: "janeDeveloper@x0gc3.onmicrosoft.com",
            img: "https://content.fakeface.rest/female_45_b3e57178eb323fee36df8e8b4690c11ef82f3baa.jpg",
          },
          {
            identity: null,
            role: "attendee",
            upn: "davejhon10@x0gc3.onmicrosoft.com",
            img: "https://static.generated.photos/vue-static/face-generator/landing/wall/14.jpg",
          }
        );
      }
  
      let meetingData = JSON.parse(localStorage.getItem('meetingDetails'))
      // if (meetingData.participants["attendees"].length < 20) {
      //   meetingData.participants["attendees"].push(
      //     {
      //       identity: null,
      //       role: "attendee",
      //       upn: "janeDeveloper@x0gc3.onmicrosoft.com",
      //       img: "https://content.fakeface.rest/female_45_b3e57178eb323fee36df8e8b4690c11ef82f3baa.jpg",
      //     },
      //     {
      //       identity: null,
      //       role: "attendee",
      //       upn: "davejhon10@x0gc3.onmicrosoft.com",
      //       img: "https://static.generated.photos/vue-static/face-generator/landing/wall/14.jpg",
      //     }
      //   );
      // }
       console.log(meetingData)
      this.setState({
        rows:meetingData.participants["attendees"]
      })
  };

  getMemberDetails = async () => {
    let currentId = this.state.currentUser.id;
    let request = {
      chatId: this.state.chatId,
      memberId: currentId,
    };

    // if (this.props.metingDetails[0]?.participants["attendees"].length < 20) {
    //     this.props.metingDetails[0]?.participants["attendees"].push(
    //       {
    //         identity: null,
    //         role: "attendee",
    //         upn: "janeDeveloper@x0gc3.onmicrosoft.com",
    //         img: "https://content.fakeface.rest/female_45_b3e57178eb323fee36df8e8b4690c11ef82f3baa.jpg",
    //       },
    //       {
    //         identity: null,
    //         role: "attendee",
    //         upn: "davejhon10@x0gc3.onmicrosoft.com",
    //         img: "https://static.generated.photos/vue-static/face-generator/landing/wall/14.jpg",
    //       }
    //     );
    //   }

    this.start();

    await axios
      .post(`http://localhost:3001/tabApi/get-meeting-member-details`, request)
      .then((result) => {
        if (result.data.memberDetails) {
          this.setState({
            dbStartTime: result.data.memberDetails[0].startTime,
            meetingCost: 10,
          });
          this.getTimer(result.data.memberDetails[0].startTime);
        }
      });
  };

  getTimer = (startTime) => {
    var timeDuration = new Date() - new Date(startTime);
    var seconds = Math.floor(timeDuration / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    hours = hours - days * 24;
    minutes = minutes - days * 24 * 60 - hours * 60;
    seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
    this.state.newcurrentTimeHour = hours;
    this.state.newcurrentTimeMin = minutes;
    this.state.newcurrentTimeSec = seconds;
    this.reset();
  };

  formatTime = (val, ...rest) => {
    console.log('called')
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
      this.getCosting();
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

  updateDisplayAmount = (totalPerSecond = 0) => {
    let displayAmount = (+this.state.displayAmount + totalPerSecond).toFixed(2),
      secondsRun = +this.state.secondsRun + 1,
      secondsDisplay = (secondsRun % 60).toString().padStart(2, "0"),
      minutesDisplay = (Math.floor(secondsRun / 60) % 60)
        .toString()
        .padStart(2, "0"),
      hoursDisplay = Math.floor(secondsRun / 3600)
        .toString()
        .padStart(2, "0");

    this.setState({
      displayAmount,
      secondsRun,
      secondsDisplay,
      minutesDisplay,
      hoursDisplay,
    });
  };

  reset = () => {
    this.setState({
      currentTimeHour: this.state.newcurrentTimeHour,
      currentTimeMs: 0,
      currentTimeSec: this.state.newcurrentTimeSec,
      currentTimeMin: this.state.newcurrentTimeMin,
    });
  };

  getCosting = () => {
    let a =
      this.state.newcurrentTimeSec +
      this.state.newcurrentTimeMin * 60 +
      this.state.newcurrentTimeHour * 60 * 60;
    let data;
    this.setState({
      totaltimer:
        this.state.newcurrentTimeSec +
        this.state.newcurrentTimeMin * 60 +
        this.state.newcurrentTimeHour * 60 * 60,
      totalAmount: this.state.totaltimer * this.state.meetingCost,
    });
    //  return this.setState({
    //     totalAmount : (this.state.newcurrentTimeSec + (this.state.newcurrentTimeMin  * 60) + (this.state.newcurrentTimeHour * 60 *60)) * this.state.meetingCost
    //   })
  };

  startRecorging = async (e) => {
    // let accessToken = localStorage.getItem("accessToken");
    // console.log('accessToken',accessToken)
    // let request = {
    //   chatId: this.state.chatId,
    //   authorization: `${accessToken}`,
    // };
    // await axios.post(`http://localhost:3001/tabApi/sendActivityNotification`, request)
    console.log(e);
    this.getMemberDetails();
  };

  showAttendees = (e) => {
    this.setState({
      showAttendees: !this.state.showAttendees,
    });
  };

  requestSearch = (searchedVal) => {
    let rows = this.state.rows

    this.setState({
      searched: searchedVal.target.value,
    });
    // setRows(rows)
    if(searchedVal.target.value !== ''){
      const filteredRows = rows.filter((row) => {
        if(row.upn !== null){
          return row.upn.includes(searchedVal.target.value);
        }
      });

      this.setState({
        rows: filteredRows,
      });
    }else{
      let meetingData = JSON.parse(localStorage.getItem('meetingDetails'))
      this.setState({
        rows: meetingData.participants["attendees"],
      });

    }
  };

  render() {
    let meetingCost = this.state.meetingCost;
    let meetingStartTime = this.state.dbStartTime;
    let featureNotActive = this.state.featureNotActive;
    let featureNotActiveMessage = this.state.featureNotActiveMessage;

    function stringAvatar(name) {
      if (name !== null) {
       return name.charAt(0)
      }
    }

    function stringToColor(string) {
      let hash = 0;
      let i;
      /* eslint-disable no-bitwise */
      for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
      }
  
      let color = "#";
  
      for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
      }
      /* eslint-enable no-bitwise */
  
      return color;
    }

    const randomColor = ()=> {
      let hex = Math.floor(Math.random() * 0xFFFFFF);
      let color = "#" + hex.toString(16);
    
      return color;
    }

    function getName(name) {
      return name.split("@")[0];
    }

    const StyledPaper = styled(Paper)(({ theme }) => ({
      backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
      ...theme.typography.body2,
      padding: theme.spacing(2),
      color: theme.palette.text.primary,
    }));

    const message = `Truncation should be conditionally applicable on this long line of text
     as this is a much longer line than what the container can support. `;

     const inputstyles = {
      root: {
        background: "black"
      },
      input: {
        color: "white"
      }
    };
    return (
      <>
      
      {!featureNotActive ? (
        <>
         {!this.state.showAttendees ? (
              <Card sx={{ maxWidth: 345 }} className="in_meeting_card">
                <CardContent>
                  <Typography
                    sx={{
                      justifyContent: "center",
                      background: "#605E5C",
                      borderRadius: "16px",
                      padding: "2px 3px",
                      width: "100px",
                    }}
                    gutterBottom
                  >
                    Topic
                  </Typography>
                  <Typography
                    sx={{ fontSize: "12px", fontFamily: "Segoe UI" }}
                    variant="h6"
                    component="span"
                  >
                    Standup call for meeting Extension
                  </Typography>
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      fontSize: "52px",
                      fontWeight: "500",
                      fontFamily: "Segoe UI",
                    }}
                  >
                    &nbsp;$ 140
                  </span>
                </CardContent>
                <CardActions className="justify-end card_actions">
                  
                  <Button
                    size="small"
                    color="primary"
                    className="card_actions_button"
                    onClick={(e) => {
                      this.showAttendees(e);
                    }}
                  >
                    See Attendees list
                  </Button>
                </CardActions>
              </Card>
            ) : (
              <Card sx={{ maxWidth: 345,height: '80%',overflowY:'auto' }} className="meeting_card_2">
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      padding: "3% 3%",
                      display: "block",
                      marginLeft: "auto",
                      color: "white",
                      width: "100%",
                      fontSize: 18,
                      fontFamily: "Segoe UI",
                      ju:"center"
                    }}
                    color="text.primary"
                    gutterBottom
                  >
                <i class="fa-solid fa-circle-arrow-left pointer-cursor" onClick={(e)=>{this.showAttendees(e)}}></i>
                    &nbsp;Attendees list
                  </Typography>
                  <br/>
                  <Grid >
                          <TextField
                            InputLabelProps={{
                              style: { color: '#fff' },
                            }}
                            InputProps={{
                              style: { color: '#fff' },
                            }}
                            label="Search Participants"
                            className="search_field_inMeet"
                            type="search"
                            value={this.state.searched}
                            onChange={(searchVal) => this.requestSearch(searchVal)}
                          />
                      </Grid>

                  {this.state.rows.map(
                    function (i, index) {
                      return (
                        <>
                        {i.upn && (<StyledPaper className="attendee_card" key={index}>
                          <Grid container wrap="nowrap" spacing={2}>
                            <Grid item>
                              <Avatar style={{
                                    backgroundColor: stringToColor(i.upn? i.upn : 'guest')
                                  }}>{stringAvatar(i.upn)}</Avatar>
                            </Grid>
                            <Grid item xs zeroMinWidth>
                              <Typography
                                noWrap
                                color="text.primary"
                                className="font-white"
                              >
                                { i.upn ? getName(i.upn) : 'guest'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </StyledPaper>)}
                        </>

                      );
                    }
                  )}
                </Box>
              </Card>
            )}  
          <Card className="timer_card">
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 400,
                  padding: "3% 3%",
                  display: "flex",
                  marginLeft: "auto",
                  backgroundColor: "black",
                  color: "white",
                  width: "100%",
                  fontSize: 16,
                  fontFamily: "Segoe UI",
                }}
                color="text.primary"
                gutterBottom
              >
                Meeting Time
              </Typography>
              <CardContent
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "left",
                }}
              >
                <StopwatchDisplay
                  ref="display"
                  {...this.state}
                  formatTime={this.formatTime}
                />
              </CardContent>
            </Card>
        </>
      ) : (
      <>
      <Card className="main_card_inMeet">
                <CardContent>
                  <Typography variant="h6" component="span">
                    Cost calculator feature
                  </Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="h6" component="span">
                    {featureNotActiveMessage}
                  </Typography>
                </CardContent>
              </Card>
      </>) }
                
           

            {/* {!featureNotActive ? (
              <Card className="main_card_inMeet">
                <CardContent>
                  <Typography variant="h6" component="h5">
                    Do you want to record meeting cost ?
                  </Typography>
                  <br />
                  <br />
                  <Button
                    variant="contained"
                    startIcon={<PlayCircleFilledIcon />}
                    sx={{ background: "orange" }}
                    onClick={(e) => {
                      this.startRecorging(e);
                    }}
                  >
                    Start Recording
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="main_card_inMeet">
                <CardContent>
                  <Typography variant="h6" component="span">
                    Cost calculator feature
                  </Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="h6" component="span">
                    {featureNotActiveMessage}
                  </Typography>
                </CardContent>
              </Card>
            )} */}

        {/* {!meetingStartTime && (
          <>
            {featureNotActive ? (
              <Card className="main_card_inMeet">
                <CardContent>
                  <Typography variant="h6" component="h5">
                    Do you want to record meeting cost ?
                  </Typography>
                  <br />
                  <br />
                  <Button
                    variant="contained"
                    startIcon={<PlayCircleFilledIcon />}
                    sx={{ background: "orange" }}
                    onClick={(e) => {
                      this.startRecorging(e);
                    }}
                  >
                    Start Recording
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="main_card_inMeet">
                <CardContent>
                  <Typography variant="h6" component="span">
                    Cost calculator feature
                  </Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="h6" component="span">
                    {featureNotActiveMessage}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </>
        )} */}
      </>
    );
  }
}

export default InMeetUI;
