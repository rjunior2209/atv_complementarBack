const express = require('express');
const { newReceita, updateReceita, deleteReceita, viewById } = require('../database/receitas');
const auth = require('../middleware/auth');
const zod = require('zod');
const router = express.Router();

const ReceitaSchema = zod.object({
    name: zod.string({
        required_error: 'nome obrigatorio', invalid_type_error: 'nome deve ser uma string', }),
    description: zod.string().min(5),
    tempPreparo: zod.string(),
})

router.get('/view/receitas', auth, async (req, res) => {
    try {
        const receitas = await viewById(req.idUser);
        res.json({
            data: receitas,
        })
    } catch (error) {
        if (error instanceof zod.ZodError) {
            return res.status(422).json({
                messagem: error.errors,
            });
        }
        res.status(500).json({ messagem: "erro do servidor" });
    }
})

router.post('/create/receitas', auth, async (req, res) => {
    try {
        const novaReceita = ReceitaSchema.parse(req.body);
        const user = req.idUser;
        const savedReceita = await newReceita(novaReceita, user);
        res.status(201).json({
            data: savedReceita,
        });
    } catch (error) {
        if (error instanceof zod.ZodError) {
            return res.status(422).json({
                messagem: error.errors,
            });
        }
        res.status(500).json({ messagem: "erro do servidor" });
    }
})

router.put('/update/receitas/:id', auth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const receitas = ReceitaSchema.parse(req.body);
        const receitaUpdated = await updateReceita(id, receitas, req.idUser);
        res.json({
            data: receitaUpdated,
        })
    } catch (error) {
        if (error instanceof zod.ZodError) {
            return res.status(422).json({
                messagem: error.errors,
            });
        } else if (error.messagem === "erro, usuario não autorizado") {
            return res.status(401).json({
                messagem: error.messagem,
            });
        }
        res.status(500).json({ messagem: "erro do servidor" });
    }

})

router.delete('/delete/receitas/:id', auth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        await deleteReceita(id, req.idUser);
        res.status(204).send('Receita deletada com sucesso');
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(422).json({
                messagem: error.errors,
            });
        } else if (error.message === "erro, usuario não autorizado") {
            return res.status(401).json({
                messagem: error.messagem,
            });
        }
        res.status(500).json({ messagem: "erro do servidor" });
    }
})

module.exports = { router, };