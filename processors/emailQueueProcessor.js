const sendEmailCreationEmail = require("../mail/sendAccountCreationEmail");

const emailQueueProcessor = async (job, done) => {
    try {
        //console.log(job.data.user);
        const { name, email } = job.data.user
        await sendEmailCreationEmail({
            name,email
        })
        done();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = emailQueueProcessor;