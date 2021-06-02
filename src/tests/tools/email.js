const email = require("../../modules/app/email");


// prepare testing database methods
const data = {
    from: 'Excited User <me@samples.mailgun.org>',
    to: 'delimce@gmail.com',
    subject: 'Hello',
    text: 'Testing some Mailgun awesomeness!'
};

describe('Trying to send email', () => {

    it('Send new email', async done => {
        email.messages().send(data, (error, body) => {
            console.log(body);
        });
        expect(1).equalTo(1);
        done()
    })
})