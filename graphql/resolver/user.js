const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../modules/User');

// @Secured endpoints: user, createUser
// @Public endpoints: login
module.exports = {
    user: async (args, req) => {
      if(!req.isAuth) return new Error('Unauthorized')
      try {
        const user = await User.findById(args.userId);
        return user;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    createUser: async (args, req) => {
      // console.log(req.body)
      if(!req.isAuth) return new Error('Unauthorized')
      const userData = {
        name: args.user.name,
        email: args.user.email,
        password: args.user.password,
      };
      for (let val in userData) {
        if (val === 'password') continue;
        userData[val] = userData[val].trim();
      }
      if (Object.values(userData).some(el => el === '' || !el)) {
        throw new Error('Invalid data');
      }

      try {
        let user = await User.findOne({ email: userData.email });
        if (user) throw new Error('User already exist.');
        userData.password = await bcrypt.hash(userData.password, 12);
        user = await new User(userData).save();
        user.password = null; // though, there's no endpoint to return the password
        return user;
      } catch (err) {
        throw new Error(err);
      }
    },
    login: async args => {
      const email = args.email;
      const password = args.password;
      try {
        const user = await User.findOne({ email });
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) throw new Error('Invalid email or password');
        const token = await jwt.sign(
          { _id: user.id, email },
          process.env.JWT_SECRET,
          {
            expiresIn: '3h',
          }
        );
        if (!token) throw new Error('Invalid email or password');
        delete user.password;
        user.token = token;
        user.expires = 3;
        return user;
      } catch (error) {
        throw new Error(error);
      }
    },
  }