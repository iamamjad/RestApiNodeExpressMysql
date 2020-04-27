const express = require('express');
const router = express.Router();
const _ = require('underscore');
const connection = require('../../middleware/connection');
const apiFilter = require('./../../middleware/apifilter');



// Get All transactions

// Retrieve all users 
router.get('/', apiFilter, function  (req, res) {
    console.log(`SELECT DISTINCT accounts.currency,transactions.percent_change,users.id,transactions.account_id,transactions.balance,transactions.event_type, transactions.date,accounts.country FROM users INNER JOIN accounts ON users.id = accounts.id INNER JOIN transactions ON accounts.id = transactions.account_id 
    WHERE accounts.currency = ALL 
    (SELECT currency FROM accounts WHERE currency = '${req.filter.currency}') 
    AND 
    users.is_active =  ALL (SELECT is_active FROM users WHERE is_active = '${req.filter.is_active}')
    AND
    users.type = ALL (SELECT type FROM users  WHERE type = '${req.filter.user_type}')
    AND
    accounts.type = ALL (SELECT type FROM accounts WHERE type = '${req.filter.account_type}')
    LIMIT 100`);

    
    connection.query(`SELECT DISTINCT accounts.currency,transactions.percent_change,users.id,transactions.account_id,transactions.balance,transactions.event_type, transactions.date,accounts.country FROM users INNER JOIN accounts ON users.id = accounts.id INNER JOIN transactions ON accounts.id = transactions.account_id 
    WHERE accounts.currency = ALL 
    (SELECT currency FROM accounts WHERE currency = '${req.filter.currency}') 
    AND 
    users.is_active =  ALL (SELECT is_active FROM users WHERE is_active =  '${req.filter.is_active}')
    AND
    users.type = ALL (SELECT type FROM users  WHERE type = '${req.filter.user_type}')
    AND
    accounts.type = ALL (SELECT type FROM accounts WHERE type = '${req.filter.account_type}')
    LIMIT 100`,
        function (error, results) {
            if (error) throw error;
            let groupByCountry = _.groupBy(results, function (item) { return item.country }); // used _ (underscore js) groupBy function to group all transaction by country
            let mappedArr = _.map(groupByCountry, (latest_transactions) => {
                let balanceArray = []  //empty array to store all the balance of country

               
                let percentChangeArr = []  //empty array to store all the percent_change of country
                _.forEach(latest_transactions, (transaction) => {
                    balanceArray.push(transaction.balance)
                    percentChangeArr.push(transaction.percent_change)
                })

                let record = {
                    country: latest_transactions[0].country, 
                    aggregate: {
                        // sum of balanceArray
                        balance: _.reduce(balanceArray, function (a, b) {
                            return a + b;
                        }, 0),
                        //sum of percentChangeArr divided by total number of transactions
                        percent_change: _.reduce(percentChangeArr, function (a, b) { 
                            return a + b; 
                        }, 0) / percentChangeArr.length
                    },
                    // array map function to latest transactions
                    transactions: _.map(latest_transactions, (transaction) => {
                        return {
                            id: transaction.id,
                            account_id: transaction.account_id,
                            balance: transaction.balance,
                            percent_change: transaction.percent_change,
                            event_type: transaction.event_type,
                            date: transaction.date
                        }
                    })
                }
                return record
            })
            return res.send({ status: 0,data: mappedArr });
        });
});

module.exports = router;