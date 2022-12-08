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
const emailQueue2 = new Queue('emailQueue2', {
  redis: {
    port: REDIS_PORT, host: REDIS_URI
  }
})
const emailQueue3 = new Queue('emailQueue3', {
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

    users.forEach((user, index = 0) => {
      if (index % 3 == 0) {
        emailQueue.add({ user }, { attempts: 3 }).then(() => {
          if (index + 1 == users.length) {
            index = 0;
            res.json({
              meessage: "All users are added to the queue"
            })
          }
        })
      } else
        if (index % 3 == 1) {
          emailQueue2.add({ user }, { attempts: 3 }).then(() => {
            if (index + 1 == users.length) {
              index = 0;
              res.json({
                meessage: "All users are added to the queue"
              })
            }
          })
        }
        else
          if (index % 3 == 2) {
            emailQueue3.add({ user }, { attempts: 3 }).then(() => {
              if (index + 1 == users.length) {
                index = 0;
                res.json({
                  meessage: "All users are added to the queue"
                })
              }
            })
          }
      // emailQueue.add({ user }, { attempts: 3 }).then(() => {
      //   if (index + 1 == users.length) {
      //     index = 0;
      //     res.json({
      //       meessage: "All users are added to the queue"
      //     })
      //   }
      // })
    })
  } catch (error) {
    console.log(error);
    reset.status(400).json(error);
  }
}
