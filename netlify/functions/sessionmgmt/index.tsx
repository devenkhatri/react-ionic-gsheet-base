const querystring = require("querystring");
const TokenGenerator = require('uuid-token-generator');
const { GoogleSpreadsheet } = require('google-spreadsheet');
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
        const {itemID} = event.queryStringParameters;
        const isEdit = !!itemID;
        const tokenGenerator = new TokenGenerator(); // Default is a 128-bit token encoded in base58
        const token = tokenGenerator.generate();

        const doc = new GoogleSpreadsheet(process.env.REACT_APP_GOOGLE_SHEETS_ID);
        let privateKey = process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n')
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: privateKey,
        });
        await doc.loadInfo(); // loads document properties and worksheets
        const sheet = doc.sheetsByTitle['Sessions']; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

        const patientId = body.patientId;
        const sessionDate = moment(body.sessionDate).tz("Asia/Kolkata").format("DD-MMM-YYYY, ddd");
        console.log("********* sessionDate", sessionDate)
        console.log("********* body.sessionDate", body.sessionDate)
        const amountPaid = Number.parseInt(body.amountPaid || 0)
        const amountPending = Number.parseInt(body.amountPending || 0)
        const paymentMode = body.paymentMode
        const depositAmount = Number.parseInt(body.depositAmount || 0)
        const reportSessionDate = moment(body.sessionDate).tz("Asia/Kolkata").format("DD-MMM-YYYY")
        const reportPatientName = body.patientName
        const reportCollectionAmount = amountPaid + depositAmount

        let message = "";
        if(!isEdit) { // adding a row
            const dataToAdd = {
                '🔒 Row ID': token,
                'Patient ID': patientId,  
                'Session Date': sessionDate,
                'Amount Paid': amountPaid,
                'Amount Pending': amountPending,
                'Payment Mode': paymentMode,
                'Deposit Amount': depositAmount,
                'Report: Session Date': reportSessionDate,
                'Report: Patient Name': reportPatientName,
                'Report: Collection Amount': reportCollectionAmount,
            }
            console.log("****** dataToAdd", dataToAdd)
            await sheet.addRow(dataToAdd);
            message = "Session Added Successfully."
        } else { //editing a row
            const rows = await sheet.getRows();
            if(rows && rows.length > 0) {
                const rowIndex = _.findIndex(rows, { "🔒 Row ID": itemID });
                rows[rowIndex]['Patient ID'] = patientId
                rows[rowIndex]['Session Date'] = sessionDate
                rows[rowIndex]['Amount Paid'] = amountPaid
                rows[rowIndex]['Amount Pending'] = amountPending
                rows[rowIndex]['Payment Mode'] = paymentMode
                rows[rowIndex]['Deposit Amount'] = depositAmount
                rows[rowIndex]['Report: Session Date'] = reportSessionDate
                rows[rowIndex]['Report: Patient Name'] = reportPatientName
                rows[rowIndex]['Report: Collection Amount'] = reportCollectionAmount
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