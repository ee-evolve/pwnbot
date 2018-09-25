const axios = require('axios');

const LAST_CHECK_DATE = new Date().setDate(new Date().getDate() - 365);

getUsers()
    .then(users => {
        for (let i = 0; i < users.length; i++) {
            getBreachedDomains(users[i].email)
                .then(domains => {
                    if(domains.length > 0) {
                        let text = users[i].id + " has had their account leaked by " + domains.join(",");
                        postSlackMessage(text);
                    }
                });
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
                users.push({
                    id: 123,
                    email: 'ed.wilson2@hotmail.co.uk'
                });
                resolve(users);
            })
            .catch(e => {
                reject(e.message);
            })
    })
}

function getBreachedDomains(email) {
    let path = 'https://haveibeenpwned.com/api/v2/breachedaccount/' + email;
    const config = {
        headers: {
            'User-Agent': 'Equal Experts Slackbot Checker'
        }
    };
    return new Promise(((resolve, reject) => {
        axios.get(path, config)
            .then(response => {
                let domains = response.data.filter(event => new Date(event.AddedDate) > LAST_CHECK_DATE)
                    .map(event => event.Domain || event.Title);

                resolve(domains)
            })
            .catch(e => {
                if (e.response.status === 404) {
                    resolve([])
                } else {
                    reject(e.message)
                }
            });
    }));
}

function postSlackMessage(text) {
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };

    let body = {
        'text': text
    };

    let url = 'https://hooks.slack.com/services/' + process.env.SLACK_WEBHOOK;
    return axios.post(url, body, config)
        .then(() => {
            console.log('Sent')
        })
        .catch(e => {
            console.log(e.message)
        })
}