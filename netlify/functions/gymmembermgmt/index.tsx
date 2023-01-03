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
        let message = "";

        console.log("****** body", body)

        const name = body.name;
        const email = body.email;
        const profilePhoto = body.profilePhoto;
        const sphone = body.phone;
        const joiningDate = moment(body.joiningDate).tz("Asia/Kolkata").format("DD-MMM-YYYY");
        const months = body.months || 0;
        const isPersonalTraining = body.isPersonalTraining;
        const paymentMode = body.paymentMode;
        const amountReceived = body.amountReceived;
        const amountPending = body.amountPending;        

        //calculating membership end date
        const endDate = moment(body.joiningDate)
        endDate.add(_.toNumber(months), "month").add(-1, "day")
        const endingDate = endDate.format("DD-MMM-YYYY");
        //calculating reminders
        const remainder1 = moment(endDate)
        remainder1.add(-15, "days");
        const remainder2 = moment(endDate)
        remainder2.add(-7, "days");
        const remainder3 = moment(endDate)
        remainder3.add(-2, "days");
        

        const doc = new GoogleSpreadsheet(process.env.REACT_APP_GOOGLE_SHEETS_ID);
        let privateKey = process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n')
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: privateKey,
        });
        await doc.loadInfo(); // loads document properties and worksheets
        const sheet = doc.sheetsByTitle['GymMembers']; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]        
        
        if(!isEdit) { // adding a row
            const dataToAdd = {
                '🔒 Row ID': token,
                'Name': name,  
                'Email': email,
                'Phone': sphone,
                'Joining Date': joiningDate,
                'Months': months,
                'IsPersonalTraining': isPersonalTraining,
                'Ending Date': endingDate,
                'Payment Mode': paymentMode,
                'Amount Received': amountReceived,
                'Amount Pending': amountPending,
                'Reminder-1': remainder1.format("DD-MMM-YYYY"),
                'Reminder-2': remainder2.format("DD-MMM-YYYY"),
                'Reminder-3': remainder3.format("DD-MMM-YYYY"),
                'Profile Photo': profilePhoto,
            }
            console.log("****** dataToAdd", dataToAdd)
            await sheet.addRow(dataToAdd);
            message = "Session Added Successfully."
        } else { //editing a row
            const rows = await sheet.getRows();
            if(rows && rows.length > 0) {
                const rowIndex = _.findIndex(rows, { "🔒 Row ID": itemID });
                rows[rowIndex]['Name'] = name
                rows[rowIndex]['Email'] = email
                rows[rowIndex]['Phone'] = sphone
                rows[rowIndex]['Joining Date'] = joiningDate
                rows[rowIndex]['Months'] = months
                rows[rowIndex]['IsPersonalTraining'] = isPersonalTraining
                rows[rowIndex]['Ending Date'] = endingDate
                rows[rowIndex]['Payment Mode'] = paymentMode
                rows[rowIndex]['Amount Received'] = amountReceived
                rows[rowIndex]['Amount Pending'] = amountPending
                rows[rowIndex]['Reminder-1'] = remainder1.format("DD-MMM-YYYY")
                rows[rowIndex]['Reminder-2'] = remainder2.format("DD-MMM-YYYY")
                rows[rowIndex]['Reminder-3'] = remainder3.format("DD-MMM-YYYY")
                rows[rowIndex]['Profile Photo'] = profilePhoto
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