import {
    Configuration, UsVerification, UsVerifications, USVerificationsApi, UsVerificationsWritable
} from "@lob/lob-typescript-sdk";

import { Request, Response } from 'express';

const av_config: Configuration = new Configuration({
    username: process.env.LIVE_KEY
});

exports.calc = function (req: Request, res: Response) {
    const UsVerifications = new USVerificationsApi(av_config);
    const verificationData: UsVerificationsWritable = {
        primary_line: req.body.address_line1,
        city: req.body.address_city,
        state: req.body.address_state,
        zip_code: req.body.address_zip,
    };
    let rezz = Number(req.body.num1) + Number(req.body.num2)   

    res.status(200).json({
      result: rezz
    });
 }