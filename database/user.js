const prisma = require('./prisma');

const newUser = (user) => {
    return prisma.Usuario.create({
        data: {
            name: user.name,
            email: user.email,
            password: user.password,
        }
    })
}

const findByEmail = (email) => {
    return prisma.Usuario.findUnique({
        where: {
            email
        },
    })
};

const findById = (id) => {
    return prisma.Usuario.findUnique({
        select: {
            id: true,
            name: true,
            email: true,
            password: false,
        },
        where: {
            id
        },
    })
};

module.exports = {
    newUser,
    findByEmail,
    findById,
}