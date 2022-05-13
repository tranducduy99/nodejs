const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'test',
    email: 'test@example.com',
    password: '12345678',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}
beforeEach( async() => {
   await User.deleteMany();
   await new User(userOne).save();
})
test('Should signup a new user', async () => {
   const response =  await request(app).post('/users').send({
        name: 'hainv',
        email: 'hainv@ttc-solutions.com.vn',
        password: '12345678'
    }).expect(201)

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
    
    expect(response.body.user.name).toBe('HAINV');

    expect(response.body).toMatchObject({
        user: {
            name: 'HAINV',
            email: 'hainv@ttc-solutions.com.vn',
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('12345678')
})
test('Should login existing user', async () => {
    const response =  await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token)
    console.log(user)
})
test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: '3232323232'
    }).expect(400)
})
test('Should get profile for user', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})
test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})
test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull();
})
test('Should not delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/test.png')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})