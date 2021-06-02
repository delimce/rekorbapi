'use strict';
require('dotenv').config()
const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_API_DOMAIN;
const Email = require('mailgun-js')({ apiKey: apiKey, domain: domain, url: 'https://api.eu.mailgun.net' });
const emailFrom = "Rekorbit app <noreply@rekorbit.es>";
let emailData = {
    from: emailFrom,
    to: "",
    subject: "",
    text: "",
    html: ""
}
module.exports = {
    setTo(email) {
        emailData.to = email
    },
    setText(text) {
        emailData.text = text
    },
    setHtml(html) {
        emailData.html = html
    },
    setSubject(subject) {
        emailData.subject = subject
    },
    async send() {
        return Email.messages().send(emailData)
    }
};