const Agent = require('../models/agent.model');

const agent_availability = (req, res, next) => {
    const { email } = req.body;

    Agent.findOne({ email })
        .then((agent) => {
            if (agent.available_for_work) {
                return next();
            } else {
                return res.status(403).json({
                    status: 'failed',
                    error: `You are not currently available to work. Kindly change this settings to view jobs.`,
                });
            }
        })
        .catch();
    return next(); //remove this to enable auth and uncomment above
};

module.exports = agent_availability;