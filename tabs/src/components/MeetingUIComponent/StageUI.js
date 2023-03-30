import React from "react";
import { useTeams } from "msteams-react-base-component";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const StageViewBasicTab = () => {
  const [{ context }] = useTeams();
  const [entityId, setEntityId] = useState();
  const [inStageView, setInStageView] = useState(true);
  const [chatId, setChatId] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [meetingDuration, setmeetingDuration] = useState();
  const [meetingParticipants, setmeetingParticipants] = useState([]);
  const [counter, setcounter] = useState(0);

  useEffect(() => {
    if (context) {
      setEntityId(context.entityId);
      setChatId(context["chat"]["id"]);
      setMeetingId(context["meeting"]["id"]);
      setTimeout(() => {
        if (counter == 0) {
          getMeetingHistory(meetingId);
          setcounter(1);
        }
      }, 2000);
    }
  });

  const getDuration = (startTime, endTime) => {
    var timeDuration = new Date(endTime) - new Date(startTime);
    var minutes = Math.floor(timeDuration / 60000);
    var seconds = ((timeDuration % 60000) / 1000).toFixed(0);
    return minutes >= 1 ? minutes + "min " + seconds + "s" : seconds + "s";
  };

  const getMeetingHistory = async (meetingId) => {
    await axios
      .get(`http://localhost:3001/tabApi/get-meeting-hystory/${chatId}`)
      .then((result) => {
        console.log("resdult", result);
      });

    let accessToken = localStorage.getItem("accessToken");
    const authHeader = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    await axios
      .get(`https://graph.microsoft.com/beta/chats/${chatId}`, authHeader)
      .then(async (chat) => {
        axios
          .get(
            `https://graph.microsoft.com/v1.0/me/onlineMeetings?$filter=JoinWebUrl%20eq%20'${chat.data.onlineMeetingInfo?.joinWebUrl}'`,
            authHeader
          )
          .then((res) => {
            setmeetingParticipants(
              res["data"]["value"][0]["participants"]["attendees"]
            );
            setmeetingDuration(
              getDuration(
                res["data"]["value"][0]["startDateTime"],
                res["data"]["value"][0]["endDateTime"]
              )
            );
          });
      });
  };
  /**
   * The render() method to create the UI of the tab
   */
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <p className="main_subject_stage_View">
            {" "}
            Maximinzing productivity while minimizing cost.
          </p>
        </Grid>
      </Grid>

      <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg4">
            <Box className="main_card_stage_View">
              <Card className="inner_time_card_stage_View">
                <CardContent>
                  <div className="topic-heading">
                    <p>
                      <i className="far fa-dollar-sign"></i> Real time Cost
                      Calculation
                    </p>
                    &nbsp;
                  </div>
                  <Typography variant="h5" component="p">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting
                  </Typography>
                  <br />
                  <br />
                  <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg6">
                        <Card className="rounded_card_Stage" elevation={0}>
                          {/* <Box
                             sx={{ display: "flex", flexDirection: "row", justifyContent:'center', width:'100%'}}
                          > */}
                          <CardContent>
                            <Typography
                              variant="h4"
                              color="text.secondary"
                              component="h3"
                              className="justify-center width-100"
                            >
                              {meetingDuration}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              color="text.secondary"
                              component="div"
                              className="justify-center"
                            >
                              Meeting Time
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              color="text.secondary"
                              component="div"
                              className="justify-center"
                            >
                              (in mins)
                            </Typography>
                          </CardContent>
                          {/* </Box> */}
                        </Card>
                      </div>
                      <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg6">
                        <Card className="rounded_card_Stage" elevation={0}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                              width: "100%",
                            }}
                          >
                            <CardContent>
                              <Typography
                                variant="h4"
                                color="text.secondary"
                                component="h3"
                                className="justify-center"
                              >
                                {meetingParticipants.length}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                                className="justify-center"
                              >
                                Participants
                              </Typography>
                            </CardContent>
                          </Box>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardActions className="footer">
                  <Button className="button-footer">
                    See Participant list
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </div>

          <div className="ms-Grid-col ms-sm8 ms-md8 ms-lg8">
            <Card className="table_div_stage_view">
              <CardContent>
                <div className="topic-heading">
                  <p>
                    <i className="far fa-dollar-sign"></i> Real time Cost
                    Calculation
                  </p>
                </div>
                <Typography variant="h5" component="p">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting
                </Typography>


                <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Participant Name</TableCell>
                      <TableCell align="right">22/01/2022</TableCell>
                      <TableCell align="right">23/01/2022</TableCell>
                      <TableCell align="right">24/01/2022</TableCell>
                      <TableCell align="right">25/01/2022</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        Jordan Roy
                      </TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        Jordan Roy
                      </TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        Jordan Roy
                      </TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                    </TableRow>{" "}
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        Jordan Roy
                      </TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                    </TableRow>{" "}
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        Jordan Roy
                      </TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                    </TableRow>{" "}
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        Jordan Roy
                      </TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                    </TableRow>{" "}
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        Jordan Roy
                      </TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                      <TableCell align="right">18:05 min</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              </CardContent>
              <CardActions className="footer float-left no-background">
                  <Button className="button-footer">
                    Get Started
                  </Button>
                </CardActions>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default StageViewBasicTab;
