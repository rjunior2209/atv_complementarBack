const prisma = require('./prisma');

const newReceita = (receitas, idUser) => {
    return prisma.Receitas.create({
        data: {
            idUser,
            name: receitas.name,
            description: receitas.description,
            tempPreparo: receitas.tempPreparo,
        }
    });
}

const updateReceita = async (id, receitas, idUser) => {
    const receita = await prisma.Receitas.findFirst({
        where: {
            id,
        }
    })
    if (receita.idUser != idUser) {
        throw new Error("Usuario não está autorizado")
    } else{
        return prisma.Receitas.update({
        where: {
            id
        },
        data: {
            name: receitas.name,
            description: receitas.description,
            tempPreparo: receitas.tempPreparo,
        }
    });
    }
   
}
const deleteReceita = async (id, idUser, receitas) => {
    const receita = await prisma.Receitas.findFirst({
        where: {
            id,
        }
    })
    if (receita.idUser != idUser) {
        throw new Error("Usuario não está autorizado")
    } else {
    return prisma.Receitas.delete({
        where: {
            id
        },
        data: receitas,
    });
    }
};
const viewById = (idUser) => {
    return prisma.Receitas.findMany({
        where: {
            idUser
        }
    });
};

module.exports = {
    newReceita,
    updateReceita,
    deleteReceita,
    viewById,
};