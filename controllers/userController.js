const User = require("../models/User");
const sendEmailCreationEmail = require("../mail/sendAccountCreationEmail");
const { reset } = require("nodemon");
const Queue = require("bull")
const { REDIS_PORT, REDIS_URI } = require("../config/redisCredentials");

const emailQueue = new Queue('emailQueue', {
  redis: {
    port: REDIS_PORT, host: REDIS_URI
  }
})

exports.create = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.create({
      name,
      email,
    });

    await sendEmailCreationEmail({ name, email });

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.sendEmailToUsers = async (req, res) => {
  try{
    const users = await User.find();
    users.forEach((user,index) => {
      emailQueue.add({ user }).then(() => {
        if (index + 1 == users.length) {
          res.json({
            meessage: "All users are added to the queue"
          })
        }
      })
    })
  } catch (error) {
    console.log(error);
    reset.status(400).json(error);
  }
}
