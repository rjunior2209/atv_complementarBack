const express = require('express');

const { newUser, findByEmail, findById } = require('../database/user');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const zod = require('zod');

const router = express.Router();

const userValInfo = zod.object({
    name: zod.string().min(4),
    email: zod.string().email(),
    password: zod.string().min(6),
})

const loginValidInfo = zod.object({
    email: zod.string().email(),
    password: zod.string(),
})

router.post('/cadastro', async (req, res) => {
    try {
        const user = userValInfo.parse(req.body);
        const emailUsed = await findByEmail(user.email);
        if (emailUsed) {
            return res.status(400).json({ messagem: 'email ja utilizado' });
        }
        const hashedPassword = bcrypt.hashSync(user.password, 10);
        user.password = hashedPassword;
        const User = await newUser(user);
        delete User.password;
        res.status(201).json({
            user: User,
        })
    } catch (err) {
        if (err instanceof zod.ZodError) {
            return res.status(422).json({
                message: err.errors,
            });
        }
        res.status(500).json({
            messagem: 'Server error',
        });
    }

});

router.post('/login', async (req, res) => {
    try {
        const infoLogin = loginValidInfo.parse(req.body);
        const user = await findByEmail(infoLogin.email);
        if (!user) return res.status(401).send();
        const validPassword = bcrypt.compare(infoLogin.password, user.password);
        if (!validPassword) return res.status(401).send();
        const token = jwt.sign(
            {
                userId: user.id,
            },
            process.env.KEY_TOKEN,
        );
        res.status(200).json({
            token,
        });
    } catch (error) {
        if (error instanceof zod.ZodError) {
            return res.status(422).json({
                messagem: error.errors,
            });
        }
        res.status(500).json({
            messagem: 'Server error',
        });
    }

});

module.exports = { router };