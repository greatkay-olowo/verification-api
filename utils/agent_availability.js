const Agent = require('../models/agent.model');

const agent_availability = (req, res, next) => {
    const { email } = req.headers;

    Agent.findOne({ email })
        .then((agent) => {
            if (agent.available_for_work === true) {
                return next();
            } else {
                return res.status(403).json({
                    status: 'failed',
                    error: `You are not currently available to work. Kindly change this settings to view jobs.`,
                });
            }
        })
        .catch((err) => console.log(err));
};

module.exports = agent_availability;