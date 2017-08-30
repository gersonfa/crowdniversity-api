"use strict";

const stripeConfig = require('../config/stripe');
const config = require('../config/config');
const mailgun = require('../require/config/mailgun');
const stripe = require('stripe')(config.stripeApiKey);
const moment = require('moment');
const User = require('../models/user');

exports.webhook = function(req, res, next){
    //Store the event ID from the webhook
    const receivedEvent = req.body.data.id;

    //Request to expand the webhook for added security
    stripe.events.retrieve(receivedEvent, function(err, verifiedEvent){
        if (err) { return next(err); }

        //Respond to webhook events, depending on what they are
        switch(verifiedEvent.type){
            //On successful customer creation
            case "customer.created":
                console.log("Customer was created...");
                break;
            //On successful invoice payment
            case "invoice.payment_succeeded":
                User.findOne({ customerId: verifiedEvent.data.object.cutomer }, function(err, user){
                    if (err) { return next(err); }
                    
                })
        }
    })
}