const apiFilter = (req, res, next) => {
    let currency = req.query.currency || '*'
    var is_active = (req.query.active_user_only != undefined) ? 1 : '*'
    let user_type = req.query.user_type || '*'
    if (user_type == 'all') {
        user_type = '*'
    }
    let account_type = req.query.account_type || '*'

    if (account_type == 'all') {
        account_type = '*'
    } 
    else if(account_type == 'main')
    {
      account_type = 'primary'  
    }
    req.filter = {
        currency,
        is_active,
        user_type,
        account_type
    }
    next();
}

module.exports = apiFilter;