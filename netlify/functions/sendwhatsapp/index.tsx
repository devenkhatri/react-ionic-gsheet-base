const querystring = require("querystring");
const _ = require("lodash");
const moment = require("moment-timezone");

exports.handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod === "GET") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                'X-Requested-With': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Access-Control-Allow-Origin,Access-Control-Allow-Methods',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
                'Content-Type': 'application/json',
            },
        };
    }

    if (event.httpMethod === "POST") {
        // When the method is POST, the name will no longer be in the event’s
        // queryStringParameters – it’ll be in the event body encoded as a query string
        const body = JSON.parse(event.body);
        
        const mobileNumber = body.mobileNumber;
        const messageBody = body.message;

        const accountSid = "AC30403357a326adf4fa2fa3df740f6b76"//process.env.TWILIO_ACCOUNT_SID;
        const authToken = "3c84310d7256c47a4bc927e8f0c54d84"//process.env.TWILIO_AUTH_TOKEN;
        const client = require('twilio')(accountSid, authToken);

        const responseMessage = await client.messages.create({
            to: 'whatsapp:+919033033836',
            body: messageBody,
            from: 'whatsapp:+14155238886'
        })
        // .then(message => console.log(message.sid));

        return {
            statusCode: 200,
            body: JSON.stringify(responseMessage),
            headers: {
                'X-Requested-With': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Access-Control-Allow-Origin,Access-Control-Allow-Methods',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
                'Content-Type': 'application/json',
            },
        };
    }
};

// exports.handler = async (event, context) => {
//     let response
//     try {
//       response = await fetch(API_ENDPOINT)
//       // handle response
//     } catch (err) {
//       return {
//         statusCode: err.statusCode || 500,
//         body: JSON.stringify({
//           error: err.message
//         })
//       }
//     }
  
//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         data: response
//       })
//     }
//   }