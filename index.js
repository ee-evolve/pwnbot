const axios = require('axios');

const EMAILS = ['ed.wilson2@hotmail.co.uk'];

const URL = 'https://haveibeenpwned.com/api/v2/breachedaccount/';

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
        })
        .catch(function (e) {
            if (e.response.status === 404) {
                console.log("No breaches found for " + email);
            } else {
                console.log(e.message)
            }
    });

}