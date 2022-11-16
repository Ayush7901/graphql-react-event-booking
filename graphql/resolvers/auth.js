const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');




module.exports = {
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error('User doesn\'t exist!');
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, 'somesuperscretkey', {
            expiresIn: '1h'
        })

        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        };

    },

    createUser: async args => {
        try {
            const userData = await User.findOne({ email: args.userInput.email });
            if (userData) {
                throw new Error('User already exists!');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)


            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save();
            return {
                ...result._doc,
                password: null
            }
        }
        catch (err) {
            // console.log('Couldn\'t hash the password!');
            throw err;
        }

    }
}