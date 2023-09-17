const axios = require('axios');
const { v1 } = require('uuid');
const { conn } = require("../db.js")
require('dotenv').config({path: '../../.env'});
const { PAYPAL_API, PAYPAL_SECRET_KEY, PAYPAL_CLIENT_ID } = process.env;
const { PlanUserNames } = require('../db.js');
const { formatDate } = require("../Utils/formatDate.js")

const createPayment = async (req, res) => {
    const { amount, currency } = req.body;
    const body = {
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code:currency,
                value: amount
            }
        }],
        application_context: {
            brand_name: 'MiCovi',
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW',
            return_url: 'http://localhost:3002/payment/capture-payment',
            cancel_url: 'http://localhost:4200/#/plans'
        }
    }

    try{

        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');

        const {data: {access_token}} = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 
            params, {
                auth: {
                    username: PAYPAL_CLIENT_ID,
                    password: PAYPAL_SECRET_KEY
                }
            }
        )

        const {data:{links: {[1]:{href}}}} = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, body , {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        const dataId = href.split("=")[1];
        saveDataApproved(req.body, dataId)

        res.status(200).json({
            url:href
        })
    }
    catch(error){
        
        res.status(400).send('Ocurrio un error al tratar de generar tu compra')
    }

}

const captureOrder = async (req, res) => {
    const { token } = req.query;
    try {
        const {data: {payment_source: {paypal: {email_address, account_id, account_status}}}} = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {}, {
            auth: {
                username: PAYPAL_CLIENT_ID,
                password: PAYPAL_SECRET_KEY
            }
        })
        await saveDataCompleted(email_address, account_id, account_status, token)
        res.redirect('http://localhost:4200/#/home?newpay=true');

    } catch (error) {
        throw new Error(`${error}`);
    }

}

async function saveDataApproved(data, buyId){
    const { amount, currency, planName, userName, userId, characteristicsPlan } = data;

    try {
        await PlanUserNames.create({
            ID: v1(),
            userName,
            planName,
            amount,
            currency,
            characteristicsPlan,
            process: 'APPROVED',
            buyId,
            SportsInstitutionID: userId
        })

        console.log("Informacion Almacenada")
    } catch (error) {
        throw new Error("La informacion no a sido almacenada en la base de datos", error);
    }

}

async function saveDataCompleted(email_address, account_id, account_status, token) {

    try {

        const planUser = await PlanUserNames.findOne({
            where:{buyId : token}
        })

        const result = await conn.query(`SELECT * FROM planes WHERE planname = '${planUser.planName}'`);

        const dataPlan = result[1].rows;

        await PlanUserNames.update({
            process: 'COMPLETED',
            initialDate: formatDate(0),
            endDate: formatDate(dataPlan[0].plantime),
            purchaseIdentifier: account_id,
            email_address_paypal: email_address,
            planId: dataPlan[0].id,
            account_status
        },
        {
            where: {
                ID: planUser.ID
            }
        }
        )

        console.log("Información Actualizada")
    } catch (error) {
        throw new Error("La información no a sido actualizada en la base de datos", error);
    }

}

module.exports = {
    createPayment,
    captureOrder
}