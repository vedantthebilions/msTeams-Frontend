import React, { Component } from "react";
import { app } from "@microsoft/teams-js";
import Axios from "axios";
import * as Msal from "msal";
import InMeetUI from "./MeetingUIComponent/InMeetUI";
import {PreMeetUI} from "./MeetingUIComponent/PreMeetUI";
import Container from "@mui/material/Container";

class Rest extends Component {
  state = {
    accessToken: "",
    meetingId: "",
    meetingDetails: [],
    meetingContext: "",
    chatId: "",
    currentUser: [],
  };

  componentDidMount() {
    app.initialize().then(() => {
      // get AuthToken
      this.getAuthToken();
      // Get the user context from Teams and set it in the state
      app.getContext().then((context) => {
        this.setState({
          meetingContext: context,
          meetingId: context.meeting.id,
          chatId: context.chat.id,
          currentUser: context.user,
        });
        let counter = 0;
        if (counter === 0) {
          this.getMeetingDetails();
          counter++;
          console.log('rese')
        }
      });
    });
  }

  getMeetingDetails = async () => {
    if (this.state.chatId && this.state.accessToken) {
      const authHeader = {
        headers: {
          Authorization: `Bearer ${this.state.accessToken}`,
        },
      };
      await Axios.get(
        `https://graph.microsoft.com/beta/chats/${this.state.chatId}`,
        authHeader
      ).then(async (chat) => {
        Axios.get(
          `https://graph.microsoft.com/v1.0/me/onlineMeetings?$filter=JoinWebUrl%20eq%20'${chat.data.onlineMeetingInfo?.joinWebUrl}'`,
          authHeader
        ).then((res) => {
          // if (res.data?.value[0]?.participants["attendees"].length < 20) {
          //   res.data?.value[0]?.participants["attendees"].push(
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
          this.state.meetingDetails.push(res.data?.value[0]);
          localStorage.setItem('meetingDetails',JSON.stringify(res.data?.value[0]))
        });
      });
    }
  };

  getAuthToken = () => {
    const msalConfig = {
      auth: {
        // clientId: "27b4c3f0-58a6-41ea-8cd8-672448a5960e",     // My Teams App client Id
        clientId: "b497551a-65c6-47ba-872b-83c0594a654d",
      },
    };
    const msalInstance = new Msal.UserAgentApplication(msalConfig);
    if (msalInstance.getAccount()) {
      var tokenRequest = {
        // scopes: ["user.read", "mail.send"],
        scopes: [
          "user.read",
          "mail.send",
          "ChatMessage.Send",
          "Chat.ReadWrite",
        ],
      };
      msalInstance
        .acquireTokenSilent(tokenRequest)
        .then((response) => {
          // get access token from response
          // response.accessToken
          this.setState({
            accessToken: response.accessToken,
          });
          localStorage.setItem("accessToken", response.accessToken);
        })
        .catch((err) => {
          // could also check if err instance of InteractionRequiredAuthError if you can import the class.
          if (err.name === "InteractionRequiredAuthError") {
            return msalInstance
              .acquireTokenPopup(tokenRequest)
              .then((response) => {
                // get access token from response
                // response.accessToken
                this.getAuthToken();
              })
              .catch((err) => {
                console.log(err, "error ");
                // handle error
              });
          } else {
          }
        });
    } else {
      var loginRequest = {
        // scopes: ["user.read", "mail.send"], // optional Array<string>
        scopes: [
          "user.read",
          "mail.send",
          "ChatMessage.Send",
          "Chat.ReadWrite",
        ], // optional Array<string>
      };
      // user is not logged in, you will need to log them in to acquire a token
      msalInstance
        .loginPopup(loginRequest)
        .then((response) => {
          // handle response
          this.getAuthToken();
        })
        .catch((err) => {
          // handle error
          console.log("err loginPopup", err);
        });
    }
  };

  render() {
    let meetingContext = this.state.meetingContext;
    return (
      <>
        {this.state.meetingContext ? (
          <div>
            {this.state.meetingContext?.page?.frameContext === "content" ? (
              <PreMeetUI
                metingDetails={this.state.meetingDetails}
                chatId={this.state.chatId}
                accessToken={this.state.accessToken}
              />
            ) : (
              <InMeetUI
                metingDetails={this.state.meetingDetails}
                chatId={this.state.chatId}
                currentUser={this.state.currentUser}
              />
            )}
          </div>
        ) : (
          <Container
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <div className="lds-circle">
              <div></div>
            </div>
          </Container>
        )}
      </>
    );
  }
}

export default Rest;
