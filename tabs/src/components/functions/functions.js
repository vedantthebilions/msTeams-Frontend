import axios from "axios";

export const getMeetingDetail = (chatId, accessToken)=>{
    let promises = [];
    let MeetingDetails = []
    const authHeader = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
        promises.push(
            axios.get(`https://graph.microsoft.com/beta/chats/${chatId}`,authHeader).then(chat => {
            axios.get(`https://graph.microsoft.com/v1.0/me/onlineMeetings?$filter=JoinWebUrl%20eq%20'${chat.data.onlineMeetingInfo?.joinWebUrl}'`,
                  authHeader
                ).then((response)=>{
                        MeetingDetails.push(response['data']['value'][0])})
            })
          )
    return MeetingDetails 
    
    // axios.post(`http://api.qa.begenuin.com/api/v3/users/video/meta_data/69e88036-6224-4d33-a0c9-8a7ecafb2437`)
    //   .then(res => {
    //     console.log(res);
    //   })
}