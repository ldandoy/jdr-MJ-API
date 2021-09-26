import nodemailer from 'nodemailer'
import { OAuth2Client } from 'google-auth-library';

const sendEmail = async (to:string, subject: string, html: string) => {
    try {
        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_KEY, process.env.GOOGLE_OAUTH_PLAYGROUND
        )

        oAuth2Client.setCredentials({refresh_token: process.env.GOOGLE_REFRESH_TOKEN})

        const access_token = await oAuth2Client.getAccessToken()
        
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAUTH2",
                user: process.env.SENDER_MAIL_ADDRESS,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_KEY,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN
            }
        })

        // verify connection configuration
        await transport.verify(function(error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });

        const mailOptions = {
            from: process.env.SENDER_MAIL_ADDRESS,
            to: to,
            subject: subject,
            html: html
        }

        const result = await transport.sendMail(mailOptions)

        return result
    } catch (error) {
        console.log(error)
        return error
    }
}

export default sendEmail