const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Task = require('./task');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be postive number')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})  
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})
userSchema.methods.generateAuthToken = async function()  {
    const user = this;
    const token = await jwt.sign({_id: user._id}, 'tranducduy');
    user.tokens = user.tokens.concat({token});
    
    await user.save();
    return token;
}
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
}
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
        console.log('modified password')
    }
    next();
})
// Delete user tasks when yser is removed
userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
})
const User = mongoose.model('User', userSchema)

module.exports = User;