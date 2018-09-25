const axios = require('axios');

const LAST_CHECK_DATE = new Date().setDate(new Date().getDate() - 365);

getUsers()
    .then(users => {
        for (let i = 0; i < users.length; i++) {
            processEmail(users[i].email);
        }
    })
    .catch(e => console.error(e));


function getUsers() {
    return new Promise((resolve, reject) => {
        axios.get('https://slack.com/api/users.list?token=' + process.env.SLACK_OAUTH_TOKEN)
            .then(response => {
                let users = response.data.members
                    .filter(m => m.profile.email)
                    .map(m => {
                        return {
                            id: m.id,
                            email: m.profile.email
                        }
                    });
                resolve(users);
            })
            .catch(e => {
                reject(e.message);
            })
    })
}

function processEmail(email) {
    let path = 'https://haveibeenpwned.com/api/v2/breachedaccount/' + email;
    const config = {
        headers: {
            'User-Agent': 'Equal Experts Slackbot Checker'
        }
    };

    axios.get(path, config)
        .then(response => {
            let domains = response.data.filter(event => new Date(event.AddedDate) > LAST_CHECK_DATE)
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

    let url = 'https://hooks.slack.com/services/' + process.env.SLACK_WEBHOOK;
    axios.post(url, body, config)
        .then(() => {
            console.log('Sent')
        })
        .catch(e => {
            console.log(e.message)
        })
}