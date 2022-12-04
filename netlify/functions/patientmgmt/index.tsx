const querystring = require("querystring");
const TokenGenerator = require('uuid-token-generator');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const _ = require("lodash");
const moment = require("moment");

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
        const {itemID} = event.queryStringParameters;
        const isEdit = !!itemID;
        const tokenGenerator = new TokenGenerator(); // Default is a 128-bit token encoded in base58
        const token = tokenGenerator.generate();

        const doc = new GoogleSpreadsheet(process.env.REACT_APP_GOOGLE_SHEETS_ID);
        // let privateKey = process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n')
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
        });
        await doc.loadInfo(); // loads document properties and worksheets
        const sheet = doc.sheetsByTitle['Patients']; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

        const patientName = body.patientName;
        const startDate = moment(body.startDate).format("MM/DD/YYYY");
        const description = body.description
        const phone = body.phone
        const occupation = body.occupation
        const referralType = body.referralType
        const referralDetails = body.referralDetails

        let message = "";
        if(!isEdit) { // adding a row
            const dataToAdd = {
                '🔒 Row ID': token,
                'Name': patientName,  
                'Start Date': startDate,
                'Description': description,
                'Phone': phone,
                'Occupation': occupation,
                'Referral Type': referralType,
                'Referral Details': referralDetails,
            }
            console.log("****** dataToAdd", dataToAdd)
            await sheet.addRow(dataToAdd);
            message = "Session Added Successfully."
        } else { //editing a row
            const rows = await sheet.getRows();
            if(rows && rows.length > 0) {
                const rowIndex = _.findIndex(rows, { "🔒 Row ID": itemID });
                rows[rowIndex]['Name'] = patientName
                rows[rowIndex]['Start Date'] = startDate
                rows[rowIndex]['Description'] = description
                rows[rowIndex]['Phone'] = phone
                rows[rowIndex]['Occupation'] = occupation
                rows[rowIndex]['Referral Type'] = referralType
                rows[rowIndex]['Referral Details'] = referralDetails
                await rows[rowIndex].save();
                message = "Session Updated Successfully."
            }            
        }

        return {
            statusCode: 200,
            body: JSON.stringify({token:token, isEdit: isEdit, message: message, id: itemID}),
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