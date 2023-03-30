import * as React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import * as moment from "moment";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Axios from "axios";
import { app } from "@microsoft/teams-js";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Calender from "../../images/calender.png";
import Duration from "../../images/duration.png";
import people from "../../images/people.png";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import TextField from "@mui/material/TextField";
import "../App.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from '@mui/material/FormControl'
import Switch from "@mui/material/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import MenuItem from "@mui/material/MenuItem";
import { Currency } from "../../currency";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import { getMeetingDetails } from "../functions/functions";
import { styled } from "@mui/material/styles";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function PreMeetUI(props) {
  const [value, setValue] = React.useState(0);
  const [meeting, setMeeting] = React.useState({});
  const [meetingMembers, setMeetingMembers] = React.useState([]);
  const [meetingMembersCost, setMeetingMembersCost] = React.useState([]);
  const [meetingContext, setmeetingContext] = React.useState([]);
  const [meetingId, setmeetingId] = React.useState([]);
  const [chatId, setchatId] = React.useState([]);
  const [counter, setcounter] = React.useState(0);
  const [active, setActive] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [currencyPreffered, setcurrency] = React.useState("USD");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const[recordPermission, setrecordPermission] = React.useState(false);

  React.useEffect(() => {
    app.initialize().then(() => {
      // get AuthToken
      // getAuthToken();
      // Get the user context from Teams and set it in the state
      app.getContext().then((context) => {
        setmeetingContext(context);
        setmeetingId(context.meeting.id);
        setchatId(context.chat.id);
        // setState({
        //   meetingContext: context,
        //   meetingId: context.meeting.id,
        //   chatId: context.chat.id,
        //   currentUser: context.user
        // });
        // if (props.metingDetails[0]?.participants["attendees"].length < 20) {
        //   props.metingDetails[0]?.participants["attendees"].push(
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
      });
    });
    if (counter === 0) {
      getMeetingData();
      setcounter(1);
    }
  });

  const getMeetingData = async () => {
    let chatID = props.chatId;
    console.log('in here')
    await Axios.get(`http://localhost:3001/tabApi/get-meeting/${chatID}`).then(
      (result) => {
        if (result.data.meeting) {
          setMeeting(result.data.meeting[0]);
          // if (result.data.meeting[0]["recordPermission"]) {
            console.log(result.data.meeting[0]["recordPermission"])
          setrecordPermission(result.data.meeting[0]["recordPermission"]);
          // }
          setcurrency(result.data.meeting[0]["currency"]);
        }
        if (result.data.meetingMembers) {
          setMeetingMembers(result.data.meetingMembers);
        }
        if (result.data.costDetails) {
          setMeetingMembersCost(result.data.costDetails);
        }
      }
    );
  };

  const setMeetingData = async (hasPermission) => {
    let body = {
      // chatId: context.activity.conversation.id,
      chatId: props.chatId,
      // title: props.metingDetails[0]?.subject,
      // startTime: props.metingDetails[0]?.startDateTime,
      // meetingId: meetingId,
      // joinUrl: props.metingDetails[0]?.joinWebUrl,
      // meetingType: "scheduled",
      // dateTime: new Date(),
      recordPermission: hasPermission,
    };

    await Axios.post(
      `http://localhost:3001/tabApi/update-meeting-recordpermission`,
      body
    );
  };

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

  const getDuration = (startTime, endTime) => {
    var timeDuration = new Date(endTime) - new Date(startTime);
    var minutes = Math.floor(timeDuration / 60000);
    var seconds = ((timeDuration % 60000) / 1000).toFixed(0);
    return minutes >= 1 ? minutes + "min " + seconds + "s" : seconds + "s";
  };

  const getCosting = (member) => {
    let startTime = member.startTime,
      endTime = member.endTime,
      memberId = member.memberId;
    let timeDuration = new Date(endTime) - new Date(startTime);
    let duration = (timeDuration / 1000).toFixed(0);
    let memberCost = meetingMembersCost.map((item) => {
      if (item.memberId === memberId) {
        return item.cost;
      }
    });
    return (duration * memberCost).toFixed(2);
  };

  function stringAvatar(name) {
    if (name !== null) {
      return {
        sx: {
          bgcolor: stringToColor(name),
        },
        children: `${name.charAt(0)}`,
      };
    }
  }

  function getName(name) {
    return name.split("@")[0];
  }

  function getTimeZone(stardate) {
    return moment(stardate).utc().format("DD MMMM YYYY / HH:mm A z");
  }

  const handleToggle = (event) => {
    if (event === true) {
      setrecordPermission(false);
      setOpen(false);
      startRecorging("no");
    } else {
      setrecordPermission(true);
      setOpen(true);
    }
    setrecordPermission(event);
    if (event == false) {
      setOpen(true);
    }
  };

  const toggleClose = (event) => {
    setOpen(false);
  };

  const startRecorging = async (msg) => {
    if (msg === "yes") {
      let accessToken = localStorage.getItem("accessToken");
      let request = {
        chatId: chatId,
        authorization: `${accessToken}`,
        meetingDetails: props.metingDetails,
      };
      await axios.post(
        `http://localhost:3001/tabApi/sendActivityNotification`,
        request
      );
      setMeetingData(1);
    } else {
      setMeetingData(0);
    }
    // getMemberDetails();
  };

  const onChangeCurrency = async (e) => {
    e.preventDefault()
    // setcurrency(e.target.value);
    // let body = {
    //   chatId: props.chatId,
    //   currency: e.target.value,
    // };

    // await Axios.post(
    //   `http://localhost:3001/tabApi/update-meeting-currency`,
    //   body
    // );
  };

  const handleChangePage = (event, newPage) => {
    console.log("newPage", newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const Item = styled("div")(({ theme }) => ({
    // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "flex-start",
    color: theme.palette.text.secondary,
    width: "100%",
  }));

  const Item_header = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#=",
    ...theme.typography.body2,
    padding: "20px",
    gap: "180px",
    textAlign: "flex-start",
    color: theme.palette.text.secondary,
    width: "100%",
    height: "120px",
  }));

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          toggleClose(false);
        }}
      >
        <Paper className="model">
          <Card sx={{ maxWidth: "auto" }}>
            <CardHeader
              avatar={
                <Avatar sx={{ backgroundColor: "#002984" }} aria-label="recipe">
                  M
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
              subheaderTypographyProps={{
                fontSize: 16,
                fontWeight: 400,
              }}
              title="Record Meeting Cost"
              subheader="How it works?"
            />
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/UoWHXrmIszg"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
            <CardContent>
              <Typography variant="h6" color="text.primary" fontWeight={600}>
                {props.metingDetails[0]?.subject}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                fontWeight={500}
              >
                This would send a questionnaire asking personal information from
                participants, would you like to continue?
              </Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                size="medium"
                variant="outlined"
                sx={{ width: "20%" }}
                onClick={(e) => {
                  handleToggle(true);
                  toggleClose(false);
                  setrecordPermission(false);
                  startRecorging("no");
                }}
              >
                No
              </Button>
              <Button
                size="medium"
                variant="contained"
                sx={{ width: "20%" }}
                onClick={(e) => {
                  handleToggle(false);
                  toggleClose(false);
                  startRecorging("yes");
                  setrecordPermission(true);
                }}
              >
                Yes
              </Button>
            </CardActions>
          </Card>
        </Paper>
      </Modal>

      <Box sx={{ height: "100vh" }}>
        {props.metingDetails.length > 0 ? (
          <Box sx={{ width: "100%" }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              elevation={0}
              className="margin-bottom"
            >
              <Grid item xs={8} className="d-flex">
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: 500,
                    flexGrow: 1,
                    backgroundColor: "transparent",
                    borderLeft: "5px solid #EF3078",
                  }}
                  elevation={0}
                >
                  <Grid container spacing={2}>
                    <Grid item></Grid>
                    <Grid item xs={12} sm container>
                      <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                          <Typography variant="h5" component="h2">
                            {props.metingDetails[0]?.subject}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            organizer -{" "}
                            {getName(
                              props.metingDetails[0]?.participants["organizer"][
                                "upn"
                              ]
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={recordPermission}
                      onChange={(e)=>{handleToggle(e);}}
                      value={recordPermission}
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  }
                  label={
                    recordPermission ? "Recording meeting cost" : "Record meeting cost ? "
                  }
                  color="warning"
                />
              </Grid>
              {/* <Grid item xs={6}>
                <Item>3</Item>
              </Grid>
              <Grid item xs={6}>
                <Item>4</Item>
              </Grid> */}
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={3}>
                <Item_header>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm container>
                      <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                          <Typography
                            gutterBottom
                            variant="subtitle1"
                            component="div"
                          >
                            Meeting Date
                          </Typography>
                          <Typography variant="h6" color="text.primary">
                            {moment(
                              props.metingDetails[0]?.startDateTime
                            ).format("DD MMM, YYYY")}{" "}
                          </Typography>
                          <Typography variant="subtitle2" color="text.primary">
                            {moment(
                              props.metingDetails[0]?.startDateTime
                            ).format("dddd")}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item className="icons">
                        <Typography
                          variant="h3"
                          component="h3"
                          sx={{ color: "#6D61EA" }}
                        >
                          <FontAwesomeIcon icon={faCalendarAlt} size="xs" />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Item_header>
              </Grid>

              <Grid item xs={3}>
                <Item_header>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm container>
                      <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                          <Typography
                            gutterBottom
                            variant="subtitle1"
                            component="div"
                          >
                            Meeting Duration
                          </Typography>
                          <Typography variant="h6" color="text.primary">
                            {getDuration(
                              props.metingDetails[0]?.startDateTime,
                              props.metingDetails[0]?.endDateTime
                            )}
                          </Typography>
                          <Typography variant="subtitle2" color="text.primary">
                            {moment(
                              props.metingDetails[0]?.startDateTime
                            ).format("hh:mm A")}{" "}
                            -{" "}
                            {moment(props.metingDetails[0]?.endDateTime).format(
                              "hh:mm A"
                            )}{" "}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item className="icons">
                        <Typography
                          variant="h3"
                          component="h3"
                          sx={{ color: "#6D61EA" }}
                        >
                          <FontAwesomeIcon icon={faClock} size="xs" />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Item_header>
              </Grid>

              <Grid item xs={3}>
                <Item_header>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm container>
                      <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                          <Typography
                            gutterBottom
                            variant="subtitle1"
                            component="div"
                          >
                            Total Attendees
                          </Typography>
                          <Typography variant="h6" color="text.primary">
                            {
                              props.metingDetails[0]?.participants["attendees"]
                                .length
                            }{" "}
                            People
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color="text.primary"
                          ></Typography>
                        </Grid>
                      </Grid>
                      <Grid item className="icons">
                        <Typography
                          variant="h3"
                          component="h3"
                          sx={{ color: "#6D61EA" }}
                        >
                          <FontAwesomeIcon icon={faPeopleGroup} size="xs" />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Item_header>
              </Grid>

              <Grid item xs={3}>
                <Item_header>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm container>
                      <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                          <Typography
                            gutterBottom
                            variant="subtitle1"
                            component="div"
                          >
                            Currency Preffered
                          </Typography>
                          <Typography variant="h6" color="text.primary">
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Age
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={10}
                                label="Age"
                                MenuProps={{
                                  onClick: e => {
                                    e.preventDefault();
                                    }
                                  }}
                                onChange={(e)=>{onChangeCurrency(e)}}
                              >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                              </Select>
                            </FormControl>
                          </Typography>
                          <Typography variant="subtitle2" color="text.primary">
                            {/* {moment(
                              props.metingDetails[0]?.startDateTime
                            ).format("dddd")} */}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item className="icons">
                        <Typography
                          variant="h3"
                          component="h3"
                          sx={{ color: "#6D61EA" }}
                        >
                          <FontAwesomeIcon icon={faCoins} size="xs" />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Item_header>
              </Grid>
            </Grid>

            <Grid container spacing={3} className="main_container">
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <div className="d-flex bg-grey width-100 search-bar">
                    <Grid
                      container
                      rowSpacing={1}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                      <Grid item xs={6}>
                        <Item className="d-flex align-center">
                          <Typography
                            variant="h3"
                            component="h3"
                            sx={{ color: "#6D61EA" }}
                          >
                            <FontAwesomeIcon icon={faCalendarAlt} size="xs" />
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="text.primary"
                            sx={{ fontWeight: "600" }}
                          >
                            &nbsp;&nbsp;&nbsp;&nbsp;Attendees list
                          </Typography>
                        </Item>
                      </Grid>
                      <Grid item xs={6}>
                        <Item></Item>
                      </Grid>
                    </Grid>
                  </div>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell> </TableCell>
                        <TableCell>Attendees Name</TableCell>
                        <TableCell> </TableCell>
                        <TableCell>Email ID</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.metingDetails[0]?.participants &&
                        props.metingDetails[0]?.participants["attendees"]
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map(function (i, index) {
                            return (
                              <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                  {index + 1}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {" "}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {i.upn ? getName(i.upn) : "Guest"}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {" "}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {i.upn.trim()}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      {/* {rows.map((row) => (
                              <TableRow key={row.number}>
                                <TableCell component="th" scope="row">
                                  {row.number}
                                </TableCell>
                                <TableCell align="right">{row.item}</TableCell>
                                <TableCell align="right">{row.qty}</TableCell>
                                <TableCell align="right">{row.price}</TableCell>
                              </TableRow>
                            ))} */}
                      {/* <TableRow className={classes.finalRow}>
                              <TableCell align="right" colSpan={4}>
                                <b>Total Cost:</b> ${totalCost}
                              </TableCell>
                            </TableRow> */}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={
                      props.metingDetails[0]?.participants["attendees"].length
                    }
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            elevation={0}
          >
            <Grid item xs={12} className="justify-center">
              <div className="lds-circle">
                <div></div>
              </div>
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
}
