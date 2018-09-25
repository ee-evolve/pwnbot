const axios = require('axios');

const EMAILS = ['ed.wilson2@hotmail.co.uk'];

const URL = 'https://haveibeenpwned.com/api/v2/breachedaccount/';

const SLACK_URL = 'https://hooks.slack.com/services/' + process.env.SLACK_WEBHOOK;

const lastWeek = new Date().setDate(new Date().getDate() - 365);

for (let i = 0; i < EMAILS.length; i++) {
    let email = EMAILS[i];
    process(email);
}

function process(email) {
    let path = URL + email;
    const config = {
        headers: {
            'User-Agent': 'Equal Experts Slackbot Checker'
        }
    };
    axios.get(path, config)
        .then(response => {
            let domains = response.data.filter(event => new Date(event.AddedDate) > lastWeek)
                .map(event => event.Domain || event.Title);
            console.log(domains);

            postSlackMessage(domains)
        })
        .catch(e => {
            if (e.response.status === 404) {
                console.log("No breaches found for " + email);
            } else {
                console.log(e.message)
            }
        });
}

function postSlackMessage(domains) {
    const config = {
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
        .catch(e => {
            console.log(e.message)
    })
}