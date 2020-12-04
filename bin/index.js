const mongoose = require('mongoose');
const User = require('../models/User');

require('dotenv').config();

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const validate = (field, data) => {
    const errors = [];
    if (!data || data.length <= 0) errors.push(`Field ${field} is empty`);
    switch (field) {
        case 'email':
            User.findOne({ email: data }, (error, user) => {
                if (error) errors.push(error);
                if (user) errors.push("User Already Registered")
            });
            break;
        default:
            return errors;
    }

    return errors;
};

const displayErrors = (errors) => errors.forEach(error => console.log(error));

const prompt = () => {
    rl.question('Username: ', username => {
        const errors = validate('username', username);

        if (errors.length > 0) {
            displayErrors(errors);
            rl.close();
        }
        rl.question('Email: ', async email => {
            const errors = validate('email', email);
            if (errors.length > 0) {
                displayErrors(errors);
                rl.close();
            }
            rl.question('Password: ', async password => {
                const errors = validate('password', password);
                if (errors.length > 0) {
                    displayErrors(errors);
                    rl.close();
                }
                rl.question('Password (again): ', async password2 => {
                    const errors = validate('password2', password2);
                    const passwordsMatch = password === password2;

                    if (errors.length > 0 || !passwordsMatch) {
                        !passwordsMatch ? console.log("Passwords does not match!") : displayErrors(errors);
                        rl.close();
                    }
                    try {
                        await new User({ username, email, password, role: 'admin' }).save();
                        console.log("Super User Created!");
                    } catch (e) {
                        console.log(e);
                    } finally {
                        rl.close();
                    }
                });
            });
        });
    });

    rl.on('close', () => {
        process.exit();
    });
};
mongoose.connect("mongodb://localhost/scheduling-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(prompt)
    .catch(console.log);