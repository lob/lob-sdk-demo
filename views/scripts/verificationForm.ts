import {
    Configuration,
    UsVerificationsWritable, USVerificationsApi
} from "@lob/lob-typescript-sdk";
async function makeRequest(formData : FormData) {
    const av_config = new Configuration({
      username: process.env.LIVE_KEY
    });
    const UsVerifications = new USVerificationsApi(av_config);
    const verificationData : UsVerificationsWritable = {
        primary_line: formData.get("primary_line") as string,
        secondary_line: formData.get("secondary_line") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zip_code: formData.get("zip_code") as string,
    };
    const singleVerify = await UsVerifications.verifySingle(verificationData);
    $("#single_verify").html(JSON.stringify(singleVerify, null, 2));
}