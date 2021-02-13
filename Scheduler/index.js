const scheduleGenerator = require("./scheduleGeneratorForBatchProblemTest");
const error = require('../error');

module.exports = async (req, res, next) => {
    try {
        await scheduleGenerator(req.user._id);
        res.status(200).json({ success: true})
    } catch (e) {        
        return next(error(e.message))
    }
}