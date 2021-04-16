import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
    host: "smtp.googleemail.com",
    port:456,
    auth: {
        user:process.env.GMAIL_USERNAME,
        password:process.env.GMAIL_PASSWORD
    }
});



const sendMail = async({ receiver, subject, text}) => {
    const message = {
        from: process.env.GMAIL_ADDRESS,   //sender address
        to:receive, //receiver address
        subject,
        text
    }

    await transporter.sendMail(message)
}

export default sendMail;