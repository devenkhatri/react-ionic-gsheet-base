import { storage } from '../firebaseConfig';
import { getDownloadURL, ref, uploadString } from "firebase/storage";

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