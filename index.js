const axios = require('axios');

const EMAILS = ['ed.wilson2@hotmail.co.uk'];

const URL = 'https://haveibeenpwned.com/api/v2/breachedaccount/';

const SLACK_URL = 'https://hooks.slack.com/services/' + process.env.SLACK_WEBHOOK;

const lastWeek = new Date().setDate(new Date().getDate() - 365);

const config = {
    headers: {
        'User-Agent': 'Equal Experts Slackbot Checker'
    }
};

for (let i = 0; i < EMAILS.length; i++) {
    let email = EMAILS[i];
    let path = URL + email;
    axios.get(path, config)
        .then(response => {
            let domains = response.data.filter(event => new Date(event.AddedDate) > lastWeek)
                .map(event => event.Domain);
            console.log(domains);

            postSlackMessage(domains)
        })
        .catch(function (e) {
            if (e.response.status === 404) {
                console.log("No breaches found for " + email);
            } else {
                console.log(e.message)
            }
    });
}

function postSlackMessage(domains) {
    let config = {
        headers: {
            'Content-type': 'application/json'
        }
    };

    let body = {
        'text': domains.join(", ")
    };

    axios.post(SLACK_URL, body, config)
        .then(() => {
            console.log('Sent')
        })
        .catch(function (e) {
            console.log(e.message)
    })
}