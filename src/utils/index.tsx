import { storage } from '../firebaseConfig';
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import GoogleSheetsMapper from 'google-sheets-mapper';
import { useQuery } from "react-query";

export const refreshPage = () => {
    window.location.reload();
}

export const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, }).format(amount)
}

export const uploadFileToFirebase = (pathprefix: any, file: any) => {
    if (!file) return;
    const storageRef = ref(storage, `${pathprefix}/${file.filepath}`);
    return uploadString(storageRef, file.base64Data, 'data_url').then((snapshot) => {
        console.log('Uploaded a base64Data string!', snapshot);
        return getDownloadURL(storageRef)
            .then((url) => {
                console.log("****** downloadURL ", url)
                return url;
            })
    });

}

export const getWelcomeMessage = (currentGymMember: any) => {
    const welcomeMesage = `Dear ${currentGymMember["Name"]}, Your Gym Membership details at Aastha Health Plus are: Duration='${currentGymMember["Months"]} month(s)', Joining Date='${currentGymMember["Joining Date"]}' and Ending Date='${currentGymMember["Ending Date"]}'`
    return welcomeMesage;
}

export const sendWhatsappMessage = (mobileNumber: any, message: any) => {

    // Regex expression to remove all characters which are NOT alphanumeric
    let number = mobileNumber.replace(/[^\w\s]/gi, "").replace(/ /g, "");

    // Appending the phone number to the URL
    let url = `https://api.whatsapp.com/send?phone=${number}`;

    // Appending the message to the URL by encoding it
    url += `&text=${encodeURIComponent(message)}&app_absent=0`;
    // url += `&text=${message}&app_absent=0`;

    // Open our newly created URL in a new tab to send the message
    window.open(url);
};

export function useDataFromGoogleSheet (apiKey: any, sheetId: any, sheetsOptions: any) {
    return useQuery("fulldata", async () => {
        const data = await GoogleSheetsMapper.fetchGoogleSheetsData({
            apiKey,
            sheetId,
            sheetsOptions: sheetsOptions,
        });
        return data;
    })
}