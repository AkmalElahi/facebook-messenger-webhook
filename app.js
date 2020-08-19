// Handles messages events
const request = require('request');
const token = "EAALOQZCxWyXsBAJJOcdRdyopbavGmfNrpAr5iX82dKXtyQxYSKiHNdPjp7GMxXKLRBfgbGdrchnZBZC36l2Ne0AwYGgh3V01fMl4R3UxUkPsd0QPlWIdYn623qRjo7rfy6rdGatZCd3bHfnK8BVKWU79kX4IH7sOPMK9TePymZAwMTBnE0v53"
function handleMessage(sender_psid, received_message) {

    let response;

    // Check if the message contains text
    console.log("MESSAGE ECHO", received_message.is_echo)
    if (received_message.text) {

        // Creates the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
        }

    } else if (received_message.attachments) {

        // Gets the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}
// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { "text": "Thanks!" }
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        // "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "qs": { "access_token": token },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}
function handleDelivery(sender_psid, response){
    console.log('INSIDE DELIVERY', sender_psid, response)
}

function handleReads(sender_psid, response){
    console.log('INSIDE READS', sender_psid, response)
}
module.exports = {
    handleMessage,
    handlePostback,
    handleDelivery,
    handleReads
}