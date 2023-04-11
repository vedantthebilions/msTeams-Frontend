import React from "react";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { app } from "@microsoft/teams-js";
import Axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import * as moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { Currency } from "../../currency";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import TableContainer from "@mui/material/TableContainer";
import SearchBar from "material-ui-search-bar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Input from '@mui/material/Input';

export const PreMeetUI = (props) => {
  const [recordPermission, setrecordPermission] = React.useState(false);
  const [meetingContext, setmeetingContext] = React.useState([]);
  const [meetingId, setmeetingId] = React.useState([]);
  const [chatId, setchatId] = React.useState([]);
  const [counter, setcounter] = React.useState(false);
  const [meeting, setMeeting] = React.useState({});
  const [currencyPreffered, setcurrency] = React.useState("USD");
  const [meetingMembers, setMeetingMembers] = React.useState([]);
  const [meetingMembersCost, setMeetingMembersCost] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [searched, setSearched] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  React.useEffect(() => {
    app.initialize().then(() => {
      app.getContext().then((context) => {
        setmeetingContext(context);
        setmeetingId(context.meeting.id);
        setchatId(context.chat.id);
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

    if (counter == false) {
      setTimeout(() => {
        saveMeeting();
      }, 3000);
    getPropsData();

      getMeetingData();
      setcounter(true);
    }

  });

  const getPropsData = () => {
    var rows;
    let meetingData = JSON.parse(localStorage.getItem('meetingDetails'))
    rows = meetingData.participants["attendees"]
    setRows(rows);
  };
  const saveMeeting = async () => {
    let body = {
      // chatId: context.activity.conversation.id,
      chatId: props.chatId,
      title: props.metingDetails[0]["subject"],
      startTime: props.metingDetails[0].startDateTime,
      meetingId: props.metingDetails[0].id,
      joinUrl: props.metingDetails[0].joinUrl,
      meetingType: "Scheduled",
      dateTime: new Date(),
    };
    await Axios.post(`http://localhost:3001/tabApi/add-meeting`, body);
  };
  const getMeetingData = async () => {
    let chatID = props.chatId;
    await Axios.get(`http://localhost:3001/tabApi/get-meeting/${chatID}`).then(
      (result) => {
        if (result.data.meeting) {
          setMeeting(result.data.meeting[0]);
          if (result.data.meeting[0]["recordPermission"] === null) {
            setrecordPermission(false);
          } else {
            setrecordPermission(result.data.meeting[0]["recordPermission"]);
          }
          if (result.data.meeting[0]["currency"] !== null) {
            setcurrency(result.data.meeting[0]["currency"]);
          }
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

  function handleToggle(event) {
    setrecordPermission(event);

    if (event == true) {
      setrecordPermission(false);
      setOpen(false);
      startRecorging("no");
    } else {
      setrecordPermission(true);
      setOpen(true);
    }
    // setrecordPermission(event);
    // if (event == false) {
    //   setOpen(true);
    // }
  }

  function toggleClose(event) {
    setOpen(false);
  }

  const startRecorging = async (msg) => {
    if (msg === "yes") {
      let accessToken = localStorage.getItem("accessToken");
      let request = {
        chatId: chatId,
        authorization: `${accessToken}`,
        meetingDetails: props.metingDetails,
        startTime: moment(props.metingDetails[0]?.startDateTime).format(
          "hh:mm A"
        ),
        endTime: moment(props.metingDetails[0]?.endDateTime).format(
          "hh:mm A"
        ),
        dateTime: moment(props.metingDetails[0]?.startDateTime).format("dddd, MMMM DD, YYYY")
      };
      await Axios.post(
        `http://localhost:3001/tabApi/sendActivityNotification`,
        request
      );
      setMeetingData(1);
    } else {
      setMeetingData(0);
    }
    // getMemberDetails();
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

  function getName(name) {
    return name.split("@")[0];
  }

  function getDuration(startTime, endTime) {
    var timeDuration = new Date(endTime) - new Date(startTime);
    var minutes = Math.floor(timeDuration / 60000);
    var seconds = ((timeDuration % 60000) / 1000).toFixed(0);
    return minutes >= 1 ? minutes + "min " + seconds + "s" : seconds + "s";
  }

  async function handleChange(event) {
    setcurrency(event.target.value);
    let body = {
      chatId: props.chatId,
      currency: event.target.value,
    };

    await Axios.post(
      `http://localhost:3001/tabApi/update-meeting-currency`,
      body
    );
  }

  function requestSearch(searchedVal) {
    setSearched(searchedVal.target.value);
    const data = JSON.parse(localStorage.getItem('meetingDetails'))
    // setRows(rows)

    let filteredRows = [];
    // setRows(filteredRows);
    if(searchedVal.target.value !== ''){
      const filteredRows = data.participants["attendees"].filter((row) => {
        console.log(row)
        if(row.upn !== null){
          return row.upn.includes(searchedVal.target.value);
        }
      });

      setRows(filteredRows); 
    }else{
      let meetingData = JSON.parse(localStorage.getItem('meetingDetails'))
      setRows(meetingData.participants["attendees"]); 
    }}

  function cancelSearch() {
    setSearched("");
    requestSearch(searched);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const Item = styled("div")(({ theme }) => ({
    // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "flex-start",
    color: theme.palette.text.secondary,
    width: "100%",
  }));

  const Item_header = styled(Card)(({ theme }) => ({
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
                    backgroundColor: "transparent !important",
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
                      onChange={(e) => {
                        handleToggle(recordPermission);
                      }}
                    />
                  }
                  label={
                    recordPermission
                      ? "Recording meeting cost"
                      : "Record meeting cost ? "
                  }
                />
              </Grid>
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
                <>
                  <Grid container spacing={2} sx={{zIndex: 99999}}>
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
                            <TextField
                              id="outlined-select-currency"
                              className="width-70"
                              select
                              value={currencyPreffered}
                              onChange={handleChange}
                              variant="standard"
                              
                            >
                              {Currency.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>
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
                          <FontAwesomeIcon icon={faWallet} size="xs" />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              </Grid>

              {/* <Grid item xs={3}>
                <div>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm container>
                      <Grid item xs container direction="column" spacing={2}>
                        
                        <Grid item xs>
                          <Typography
                            gutterBottom
                            variant="subtitle1"
                            component="div"
                          >
                           Preffered
                          </Typography>
                          <Typography variant="h6" color="text.primary">
                            <TextField
                              id="outlined-select-currency"
                              className="z-index-9999"
                              select
                              label="Select"
                              defaultValue="EUR"
                            >
                              {Currency.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Typography>
                          <Typography variant="subtitle2" color="text.primary">
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
                </div>
              </Grid> */}
            </Grid>

            <Grid container spacing={1} className="main_container">
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <div className="d-flex bg-grey width-100 search-bar">
                    <Grid
                      container
                      rowSpacing={1}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                      <Grid item xs={9}>
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
                      <Grid item xs={3}>
                      <FormControl variant="standard">
                      <Input
                            id="standard-adornment-weight"
                            endAdornment={<InputAdornment position="end">  <SearchRoundedIcon /></InputAdornment>}
                            aria-describedby="standard-weight-helper-text"
                            inputProps={{
                              'aria-label': 'weight',
                            }}
                            type="search"
                            value={searched}
                            onChange={(searchVal) => requestSearch(searchVal)}
                          />
                            </FormControl>
                          {/* <TextField
                           startAdornment={
                            <InputAdornment position="start">
                              <AccountCircle />
                            </InputAdornment>
                          }
                            label="Search participants"
                            className="search_field"
                            type="search"
                            value={searched}
                            onChange={(searchVal) => requestSearch(searchVal)}
                          /> */}
                          {/* <SearchBar
                            
                            onCancelSearch={() => cancelSearch()}
                          /> */}
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
                      {rows
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map(function (i, index) {
                          return (
                            <>
                            {i.upn && 
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                {props.metingDetails[0]?.participants[
                                  "attendees"
                                ].indexOf(i) + 2}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {" "}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {getName(i.upn)}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {" "}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {i.upn ? i.upn.trim() : ""}
                              </TableCell>
                            </TableRow>
                            }</>
                          )})}
                            
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
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
};
