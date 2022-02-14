import {
    Configuration, USVerificationsApi
} from "@lob/lob-typescript-sdk"

async function makeRequest(formData) {
    console.log("INSIDE MAKE REQUEST");
    const av_config = new Configuration({
      username: process.env.LIVE_KEY
    });
    const UsVerifications = new USVerificationsApi(av_config);
    const verificationData = {
        primary_line: formData.get("primary_line"),
        secondary_line: formData.get("secondary_line"),
        city: formData.get("city"),
        state: formData.get("state"),
        zip_code: formData.get("zip_code"),
    };
    console.log("ABOUT TO SEND TO SDK");
    const singleVerify = await UsVerifications.verifySingle(verificationData);
    console.log("SENT TO SDK");
    $("#single_verify").html(JSON.stringify(singleVerify, null, 2));
}