const express = require('express');
const app = express();
const cors = require('cors')
const webPush = require('web-push');
const PORT = process.env.PORT || 3000;
const path = require('path');
const bodyParser = require('body-parser');


var vapidDetails = {
  subject: 'mailto:drus@qdqmedia.com',
  publicKey: 'BKOWm3Iz0Yg-k84Uk8a1YWaofSNAsYh3LRxVYPg6HVoivm2EH4s1Y73RQUsRN7m6rVeL9H33bxL9HCxs7d2DEvY',
  privateKey: 'iyFVXcBo_cNBxK_g1wnsm_J8O_Lg0wmnwKUK7dF6Kn8'
}

webPush.setVapidDetails(
  vapidDetails.subject,
  vapidDetails.publicKey,
  vapidDetails.privateKey
);

webPush.setGCMAPIKey(process.env.GCM_API_KEY || null);

const pushSubscription = {
  endpoint: '< Push Subscription URL >',
  keys: {
    p256dh: 'BKOWm3Iz0Yg-k84Uk8a1YWaofSNAsYh3LRxVYPg6HVoivm2EH4s1Y73RQUsRN7m6rVeL9H33bxL9HCxs7d2DEvY',
    auth: 'iyFVXcBo_cNBxK_g1wnsm_J8O_Lg0wmnwKUK7dF6Kn8'
  }
};

let subscriptions = [];

app.use(bodyParser.json())
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendfile(__dirname + "/public/index.html")
});
app.get('/subscriptions', (req, res) => {
  res.send(JSON.stringify(subscriptions));
})

app.post('/register', (req, res) => {
  const subscription = req.body;
  if (subscriptions.some((s) => s.name === subscription.name)) {
    res.sendStatus(304);
  } else {
    subscriptions.push(subscription);
    res.sendStatus(201);
  }
});

app.post('/sendNotification', (req, res) => {
  const subscription = req.body;

  const payload = {
    title: 'New Push Notifications',
    options: {
      lang: 'en',
      body: 'Push Notification Body',
      icon: 'https://blogs.glowscotland.org.uk/cl/strathdevonprimary/files/2015/11/success-icon.png',
      vibrate: [500, 100, 500],
      actions: [
        {
          action: 'coffee-action',
          title: 'Coffee',
          icon: 'http://www.freepngimg.com/download/coffee/2-2-coffee-png-clipart.png'
        },
        {
          action: 'doughnut-action',
          title: 'Doughnut',
          icon: 'https://cdn2.iconfinder.com/data/icons/lovely-donuts/16/purple_donut-256.png'
        }
      ]
    }
  };
  webPush
  .sendNotification(subscription, JSON.stringify(payload))
  .then(() => {
    res.sendStatus(201);
  })
  .catch((error) => {
    console.log(error);
    res.sendStatus(500);
  });;
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));