const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Forgotpassword = require('../models/forgotPassword');

const forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        const user = await User.findOne( { email });
        if(user){
            try{
                var obj = new Forgotpassword({active: true ,userId: user._id});
                obj.save();
           
            } catch(err) {
                    throw new Error(err)
                }

            sgMail.setApiKey(process.env.SENDGRID_API_KEY)

            const msg = {
                to:  'nkword1899@gmail.com', // Change to your recipient
                from: 'nkword1899@gmail.com', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:3000/password/resetpassword/${obj._id}">Reset password</a>`,
            }

            sgMail
            .send(msg)
            .then((response) => {
                return res.status(response[0].statusCode).send(`<a href="http://localhost:3000/password/resetpassword/${obj._id}">Reset password</a>`)
            })
            .catch((error) => {
                throw new Error(error);
            })

            //send mail
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

const resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findById(id).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.active= false;
            forgotpasswordrequest.save();
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input type="password" name="newpassword" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()
        }
    })
}

const updatepassword = (req, res) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ _id: resetpasswordid }).then(resetpasswordrequest => {
            User.findById(resetpasswordrequest.userId).then(user => {
                console.log('userDetails', user)
                if(user) {
                    //encrypt the password
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.password = hash ;
                                res.status(201).json( `<html>
                                                        <script>
                                                           alert('Successfuly updated the new password')
                                                           window.location = '/Login/login.html'
                                                        </script>
                                                     </html>`);
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}