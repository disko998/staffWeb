const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")("sk_test_kQXZUBlrQGHq8usd8yncs4Jv");

const FS_COLLECTION_USERS = "Users";
const FS_COLLECTION_PAYMENTS = "payments";
var cors = require("cors")({ origin: true });

// when user is created register them with stripe
exports.createStripeCustomer = functions.auth.user().onCreate(event => {
  return stripe.customers
    .create({
      email: event.email
    })
    .then(customer => {
      return admin
        .firestore()
        .collection(FS_COLLECTION_USERS)
        .doc(event.uid)
        .update({ stripe_id: customer.id });
    });
});

exports.getStripeToken = functions.https.onRequest((req, res) => {
  if (req.method === "GET") {
    const code = req.query.code;
    const uid = req.query.state;
    console.log(req.query);
    return stripe.oauth
      .token({
        grant_type: "authorization_code",
        code: code
      })
      .then(response => {
        return admin
          .firestore()
          .collection(FS_COLLECTION_USERS)
          .doc(uid)
          .update({ stripe_account_id: response.stripe_user_id })
          .then(d => {
            console.log(d);
            return res.redirect(
              "https://staffa-13e8a.firebaseapp.com/mobileApp"
            );
          })
          .catch(error => {
            return res.status(400).json({
              message: error
            });
          });
      })
      .catch(error => {
        console.log(error);
        return res.status(400).json({
          message: error
        });
      });
  } else {
    return res.status(500).json({
      message: "Invalid Request"
    });
  }
});

exports.createCheckoutSession = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method === "POST") {
      // Creating session data from payload
      const body = JSON.parse(req.body);
      const lineItem = {
        name: body.name,
        description: "add funds to make this shift live",
        amount: Number(body.amount) * 100,
        currency: "EUR",
        quantity: 1
      };
      console.log(req.body, lineItem);
      return stripe.checkout.sessions
        .create({
          payment_method_types: ["card"],
          line_items: [lineItem],
          customer: body.customerId,
          customer_email: body.customer_email,

          success_url:
            "https://staffa-13e8a.firebaseapp.com/settings?response=success",
          cancel_url:
            "https://staffa-13e8a.firebaseapp.com/settings?response=failed"
        })
        .then(session => {
          // Getting the session id
          var sessionId = session.id;
          return res.status(200).json({
            sessionId: sessionId
          });
        })
        .catch(error => {
          return res.status(500).json({
            message: error
          });
        });
    } else {
      return res.status(500).json({
        message: "Invalid Request"
      });
    }
  });
});

exports.approvePayment = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method === "POST") {
      // Creating session data from payload
      const body = JSON.parse(req.body);
      const stripe_account = body.stripe_account;
      const paymentId = body.paymentId;
      console.log(body.amount);
      return stripe.transfers
        .create({
          amount: body.amount * 100,
          currency: "gbp",
          destination: stripe_account
        })
        .then(t => {
          const paymentDoc = admin
            .firestore()
            .collection(FS_COLLECTION_PAYMENTS)
            .doc(paymentId);
          return paymentDoc
            .update({
              status: "PAID",
              transferId: t.id,
              paymentDate: formatDate(new Date())
            })
            .then(r => {
              console.log(r);
              return res.status(200).json({
                data: r
              });
            })
            .catch(err => {
              return res.status(400).json({
                message: err.message
              });
            });
        })
        .catch(err => {
          console.log(err.message);
          return res.status(400).json({
            message: err.message
          });
        });
    } else {
      return res.status(400).json({
        message: "Invalid Request"
      });
    }
  });
});

exports.getDashboardLink = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method === "POST") {
      // Creating session data from payload
      const body = JSON.parse(req.body);
      return stripe.accounts
        .createLoginLink(body.stripe_account_id)
        .then(result => {
          return res.status(200).json({
            url: body.account ? `${result.url}#/account` : result.url
          });
        })
        .catch(err => {
          return res.status(400).json({
            message: err.message
          });
        });
    } else {
      return res.status(500).json({
        message: "Invalid Request"
      });
    }
  });
});

exports.getBalance = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method === "POST") {
      // Creating session data from payload
      const body = JSON.parse(req.body);
      return stripe.balance
        .retrieve({
          stripe_account: body.stripe_account_id
        })
        .then(result => {
          return res.status(200).json({
            result
          });
        })
        .catch(err => {
          return res.status(400).json({
            message: err.message
          });
        });
    } else {
      return res.status(500).json({
        message: "Invalid Request"
      });
    }
  });
});

exports.createPayout = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method === "POST") {
      // Creating session data from payload
      const body = JSON.parse(req.body);
      return stripe.payouts
        .create(
          {
            amount: body.amount,
            currency: "gbp"
          },
          {
            stripe_account: body.stripe_account_id
          }
        )
        .then(result => {
          return res.status(200).json({
            result
          });
        })
        .catch(err => {
          return res.status(400).json({
            message: err.message
          });
        });
    } else {
      return res.status(500).json({
        message: "Invalid Request"
      });
    }
  });
});

formatDate = d => {
  var month = String(d.getMonth() + 1);
  var day = String(d.getDate());
  var year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};
