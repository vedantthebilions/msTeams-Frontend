import React, { Component } from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";
import "../App.css";
import * as axios from "axios";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

class StageUI extends Component {
  state = {
    embedUrlArr: [],
    reportArr: [
      "e02da6c9-53fd-4eab-8b3d-1b9cf4e7837b",
      "7813d7f3-0fdf-4d32-a2c2-83e3ae972986"
    ],
    accessToken:"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvOGQ2Y2Q4NjItYWNhMS00OTBkLTlkZGUtYzVhYTcyMDUyYjBiLyIsImlhdCI6MTY4MTExMzEwOSwibmJmIjoxNjgxMTEzMTA5LCJleHAiOjE2ODExMTgzMDcsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84VEFBQUFBZmlmMkJucGMwRG1YQ2pxZUN0RjhyR2dqT2d2OEthYzJsYjJaT1JHblBobUFTQ093N2tKWGFRV0t5RktIU1dlMkJpZG9QNlFVOGcyNDA5eXVBTUsvbzZHVkdBQVFSZzVKbW1aT2djRU80az0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiODcxYzAxMGYtNWU2MS00ZmIxLTgzYWMtOTg2MTBhN2U5MTEwIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJEZXYiLCJnaXZlbl9uYW1lIjoiTWljcm9zb2Z0IiwiaXBhZGRyIjoiMTAzLjI0OS4yMzMuMjAiLCJuYW1lIjoiTWljcm9zb2Z0IERldiIsIm9pZCI6IjJhNzMwODIwLWM2Y2UtNDE4ZC1iNGZjLTQzNDBmZTY1MDZmNSIsInB1aWQiOiIxMDAzMjAwMjU5MEQ3NThBIiwicmgiOiIwLkFVb0FZdGhzamFHc0RVbWQzc1dxY2dVckN3a0FBQUFBQUFBQXdBQUFBQUFBQUFDSkFOTS4iLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJ2eVhvYUF5S084eWNYQXYweEoyem5GdDB1NFRrWGJyUXhKOG9EeHZnb0lNIiwidGlkIjoiOGQ2Y2Q4NjItYWNhMS00OTBkLTlkZGUtYzVhYTcyMDUyYjBiIiwidW5pcXVlX25hbWUiOiJNaWNyb3NvZnREZXZAQmlsaW9ucy5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJNaWNyb3NvZnREZXZAQmlsaW9ucy5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiJKcHlFQnZ3WGFrQ3VKc0lSdkR2dEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiLCJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXX0.hRR17kMEHFtNt_-4aS6g7gfUp_g_uowpkg3ZAkEfucLBlI2pdabbajXpbuYGxvwilHLgv0tyF7g453tEXUbqTcVGBM6Eji4APBZVM4WM_KmzI4QgIeBsiBIW7oaRYDZpvGpLptFcXFZwAn-qKnttjKmxtkQye7IF1wXiJCRau5P8WrPLp4POUwQSWZ9qOCgm7OpIIdw2DcHc3fjpeJMit0L9SaNT8nq2Gzy0aS7b6WcEXs9rB4IrwIZ8SftFG3FtjH5V0iwsbp78AyhR2Xf5yGbNT21qudZd_cf3Pz2USE2pSn62t9uP5_HH0tg2yRXYNCrFheiFkn2ApzI2aQpdSg"
  };

  componentDidMount() {
    this.getDataByID();
	
  }

  getDataByID = async () => {
    let reportId = this.state.reportId;
	let accessToken = localStorage.getItem('accessToken')
	console.log(accessToken)
    let token = "Bearer " + this.state.accessToken;
    let Authorization = token;
	let dataArr =[];
    for (let r = 0; r <=this.state.reportArr.length ; r++) {
		if(this.state.reportArr[r] !== undefined){
			await axios
			.get(`https://api.powerbi.com/v1.0/myorg/reports/${this.state.reportArr[r]}`, {
			  headers: { Authorization: Authorization },
			})
			.then((response) => {
				dataArr.push({embedUrl : response.data.embedUrl, id: response.data.id})
			});
		}
    }
	this.setState({
		embedUrlArr: dataArr
	})
  };
  render() {
    const Item = styled(Paper)(({ theme }) => ({
      backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
      ...theme.typography.body2,
      padding: theme.spacing(1),
      textAlign: "center",
      color: theme.palette.text.secondary,
    }));
    return (
      <>
        <Box sx={{ width: "100%" }}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
			{this.state.embedUrlArr.map((data,index)=>{
				 return( 
				 <Grid item xs={6} >
				  <Item key={index}>
					<PowerBIEmbed
					  embedConfig={{
						type: "report", // Supported types: report, dashboard, tile, visual and qna
						id: data.id,
						embedUrl: data.embedUrl,
						accessToken: this.state.accessToken,
						tokenType: models.TokenType.Aad,
						settings: {
						  panes: {
							filters: {
							  expanded: false,
							  visible: true,
							},
						  },
						},
					  }}
					  eventHandlers={
						new Map([
						  [
							"loaded",
							function () {
							  console.log("Report loaded");
							},
						  ],
						  [
							"rendered",
							function () {
							  console.log("Report rendered");
							},
						  ],
						  [
							"error",
							function (event) {
							  console.log(event.detail);
							},
						  ],
						])
					  }
					  cssClassName={"embeded-report"}
					  getEmbeddedComponent={(embeddedReport) => {
						window.report = embeddedReport;
					  }}
					/>
				  </Item>
				</Grid>
				)
			})}
          
          </Grid>
        </Box>

        <div class="row">
          <div class="column"></div>
          <div class="column">2</div>
        </div>
      </>
    );
  }
}

export default StageUI;

// Previous Version Code
// import React from "react";
// import { useTeams } from "msteams-react-base-component";
// import { useState, useEffect } from "react";
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import axios from "axios";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";

// const StageViewBasicTab = () => {
//   const [{ context }] = useTeams();
//   const [entityId, setEntityId] = useState();
//   const [inStageView, setInStageView] = useState(true);
//   const [chatId, setChatId] = useState("");
//   const [meetingId, setMeetingId] = useState("");
//   const [meetingDuration, setmeetingDuration] = useState();
//   const [meetingParticipants, setmeetingParticipants] = useState([]);
//   const [counter, setcounter] = useState(0);

//   useEffect(() => {
//     if (context) {
//       setEntityId(context.entityId);
//       setChatId(context["chat"]["id"]);
//       setMeetingId(context["meeting"]["id"]);
//       setTimeout(() => {
//         if (counter == 0) {
//           getMeetingHistory(meetingId);
//           setcounter(1);
//         }
//       }, 2000);
//     }
//   });

//   const getDuration = (startTime, endTime) => {
//     var timeDuration = new Date(endTime) - new Date(startTime);
//     var minutes = Math.floor(timeDuration / 60000);
//     var seconds = ((timeDuration % 60000) / 1000).toFixed(0);
//     return minutes >= 1 ? minutes + "min " + seconds + "s" : seconds + "s";
//   };

//   const getMeetingHistory = async (meetingId) => {
//     await axios
//       .get(`http://localhost:3001/tabApi/get-meeting-hystory/${chatId}`)
//       .then((result) => {
//         console.log("resdult", result);
//       });

//     let accessToken = localStorage.getItem("accessToken");
//     const authHeader = {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     };

//     await axios
//       .get(`https://graph.microsoft.com/beta/chats/${chatId}`, authHeader)
//       .then(async (chat) => {
//         axios
//           .get(
//             `https://graph.microsoft.com/v1.0/me/onlineMeetings?$filter=JoinWebUrl%20eq%20'${chat.data.onlineMeetingInfo?.joinWebUrl}'`,
//             authHeader
//           )
//           .then((res) => {
//             setmeetingParticipants(
//               res["data"]["value"][0]["participants"]["attendees"]
//             );
//             setmeetingDuration(
//               getDuration(
//                 res["data"]["value"][0]["startDateTime"],
//                 res["data"]["value"][0]["endDateTime"]
//               )
//             );
//           });
//       });
//   };
//   /**
//    * The render() method to create the UI of the tab
//    */
//   return (
//     <>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <p className="main_subject_stage_View">
//             {" "}
//             Maximinzing productivity while minimizing cost.
//           </p>
//         </Grid>
//       </Grid>

//       <div className="ms-Grid" dir="ltr">
//         <div className="ms-Grid-row">
//           <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg4">
//             <Box className="main_card_stage_View">
//               <Card className="inner_time_card_stage_View">
//                 <CardContent>
//                   <div className="topic-heading">
//                     <p>
//                       <i className="far fa-dollar-sign"></i> Real time Cost
//                       Calculation
//                     </p>
//                     &nbsp;
//                   </div>
//                   <Typography variant="h5" component="p">
//                     Lorem Ipsum is simply dummy text of the printing and
//                     typesetting
//                   </Typography>
//                   <br />
//                   <br />
//                   <div className="ms-Grid" dir="ltr">
//                     <div className="ms-Grid-row">
//                       <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg6">
//                         <Card className="rounded_card_Stage" elevation={0}>
//                           {/* <Box
//                              sx={{ display: "flex", flexDirection: "row", justifyContent:'center', width:'100%'}}
//                           > */}
//                           <CardContent>
//                             <Typography
//                               variant="h4"
//                               color="text.secondary"
//                               component="h3"
//                               className="justify-center width-100"
//                             >
//                               {meetingDuration}
//                             </Typography>
//                             <Typography
//                               variant="subtitle1"
//                               color="text.secondary"
//                               component="div"
//                               className="justify-center"
//                             >
//                               Meeting Time
//                             </Typography>
//                             <Typography
//                               variant="subtitle1"
//                               color="text.secondary"
//                               component="div"
//                               className="justify-center"
//                             >
//                               (in mins)
//                             </Typography>
//                           </CardContent>
//                           {/* </Box> */}
//                         </Card>
//                       </div>
//                       <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg6">
//                         <Card className="rounded_card_Stage" elevation={0}>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               flexDirection: "row",
//                               justifyContent: "center",
//                               width: "100%",
//                             }}
//                           >
//                             <CardContent>
//                               <Typography
//                                 variant="h4"
//                                 color="text.secondary"
//                                 component="h3"
//                                 className="justify-center"
//                               >
//                                 {meetingParticipants.length}
//                               </Typography>
//                               <Typography
//                                 variant="subtitle1"
//                                 color="text.secondary"
//                                 component="div"
//                                 className="justify-center"
//                               >
//                                 Participants
//                               </Typography>
//                             </CardContent>
//                           </Box>
//                         </Card>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//                 <CardActions className="footer">
//                   <Button className="button-footer">
//                     See Participant list
//                   </Button>
//                 </CardActions>
//               </Card>
//             </Box>
//           </div>

//           <div className="ms-Grid-col ms-sm8 ms-md8 ms-lg8">
//             <Card className="table_div_stage_view">
//               <CardContent>
//                 <div className="topic-heading">
//                   <p>
//                     <i className="far fa-dollar-sign"></i> Real time Cost
//                     Calculation
//                   </p>
//                 </div>
//                 <Typography variant="h5" component="p">
//                   Lorem Ipsum is simply dummy text of the printing and
//                   typesetting
//                 </Typography>

//                 <TableContainer>
//                 <Table sx={{ minWidth: 650 }} aria-label="simple table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Participant Name</TableCell>
//                       <TableCell align="right">22/01/2022</TableCell>
//                       <TableCell align="right">23/01/2022</TableCell>
//                       <TableCell align="right">24/01/2022</TableCell>
//                       <TableCell align="right">25/01/2022</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     <TableRow
//                       sx={{
//                         "&:last-child td, &:last-child th": { border: 0 },
//                       }}
//                     >
//                       <TableCell component="th" scope="row">
//                         Jordan Roy
//                       </TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                     </TableRow>
//                     <TableRow
//                       sx={{
//                         "&:last-child td, &:last-child th": { border: 0 },
//                       }}
//                     >
//                       <TableCell component="th" scope="row">
//                         Jordan Roy
//                       </TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                     </TableRow>
//                     <TableRow
//                       sx={{
//                         "&:last-child td, &:last-child th": { border: 0 },
//                       }}
//                     >
//                       <TableCell component="th" scope="row">
//                         Jordan Roy
//                       </TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                     </TableRow>{" "}
//                     <TableRow
//                       sx={{
//                         "&:last-child td, &:last-child th": { border: 0 },
//                       }}
//                     >
//                       <TableCell component="th" scope="row">
//                         Jordan Roy
//                       </TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                     </TableRow>{" "}
//                     <TableRow
//                       sx={{
//                         "&:last-child td, &:last-child th": { border: 0 },
//                       }}
//                     >
//                       <TableCell component="th" scope="row">
//                         Jordan Roy
//                       </TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                     </TableRow>{" "}
//                     <TableRow
//                       sx={{
//                         "&:last-child td, &:last-child th": { border: 0 },
//                       }}
//                     >
//                       <TableCell component="th" scope="row">
//                         Jordan Roy
//                       </TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                     </TableRow>{" "}
//                     <TableRow
//                       sx={{
//                         "&:last-child td, &:last-child th": { border: 0 },
//                       }}
//                     >
//                       <TableCell component="th" scope="row">
//                         Jordan Roy
//                       </TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                       <TableCell align="right">18:05 min</TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//               </CardContent>
//               <CardActions className="footer float-left no-background">
//                   <Button className="button-footer">
//                     Get Started
//                   </Button>
//                 </CardActions>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StageViewBasicTab;
