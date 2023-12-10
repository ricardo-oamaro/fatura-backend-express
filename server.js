require("dotenv").config() // load .env variables
const express = require("express") // import express
const mongoose = require("mongoose") //import morgan
const bcrypt = require("bcrypt") // import mercedlogger's log function
const jwt = require("jsonwebtoken") // import cors
const { log } = require("mercedlogger")
const User = require('./models/User')
const Product = require('./models/Product')
const checkToken = require("./middleware/checkToken")
const getUserId = require("./middleware/getUserId")
const cors = require("cors")

//DESTRUCTURE ENV VARIABLES WITH DEFAULT VALUES
const { PORT = 8000 } = process.env

// Create Application Object
const app = express()

const secret = process.env.SECRET

const generateToken = (id) => {
    return jwt.sign({ id }, secret, {
        expiresIn: "1m",
    });
};

app.use(express.json())
app.use(cors());


app.get('/', (req, res) => {
    res.status(200).json('Bem vindo a API')
})

//Private Route
app.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id
    const user = await User.findById(id, '-password')
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado!' })
    res.status(200).json({ user })
})

app.post('/auth/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    const userExist = await User.findOne({ email: email })

    if (userExist) return res.status(422).json({ errors: 'E-mail já cadastrado, utilize outro e-mail.' })
    if (!name) return res.status(422).json({ errors: 'O nome é obrigatório' })
    if (!email) return res.status(422).json({ errors: 'O email é obrigatório' })
    if (!password) return res.status(422).json({ errors: 'A senha é obrigatória' })
    if (password !== confirmPassword) return res.status(422).json({ errors: 'As senhas não correspondem, tente novamente' })


    //Create Password
    const salt = await bcrypt.genSalt(12)
    const passwdHash = await bcrypt.hash(password, salt)

    //Create User
    const newUser = await User.create({
        name,
        email,
        password: passwdHash,
    })

    if (!newUser) {
        res.status(422).json({
            errors: ["Houve um erro, por favor tente novamente mais tarde."],
        });
        return;
    }

    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id)
    })
})

app.post('/auth/login', async (req, res) => {

    const { email, password } = req.body
    const user = await User.findOne({ email: email })

    if (!email) return res.status(422).json({ errors: 'O email é obrigatório' })
    if (!password) return res.status(422).json({ errors: 'A senha é obrigatória' })
    if (!user) return res.status(404).json({ errors: 'E-mail não encontrado!' })

    const checkPwd = await bcrypt.compare(password, user.password)
    if (!checkPwd) return res.status(422).json({ errors: 'Senha Inválida!' })

    if (!user) {
        res.status(404).json({ errors: "Usuário não encontrado!" });
        return;
    }

    res.status(200).json({
        _id: user._id,
        token: generateToken(user._id),
    });
})

const dbUser = process.env.DB_USER
const dbPasswd = process.env.DB_PASSWD

mongoose.connect(`mongodb+srv://${dbUser}:${dbPasswd}@cluster0.adsrmpi.mongodb.net/`)
    .then(
        console.log('conecquitei'),
        app.listen(PORT, () => log.green("SERVER STATUS", `Listening on port ${PORT}`))

    ).catch((err) => log.magenta('Erro ao conectar ao banco ' + err))


//Product Route

app.post('/create/product', getUserId, async (req, res) => {
    const { date, description, value } = req.body;
    if (!date) return res.status(422).json({ msg: 'Insira a data da compra' })
    if (!description) return res.status(422).json({ msg: 'A descrição não pode ser vazia' })
    if (!value) return res.status(422).json({ msg: 'Insira o valor da compra' })

    const newProduct = new Product({
        date,
        description,
        value,
        userId: userId,
    })
    try {
        await newProduct.save()
        res.status(201).json({ msg: 'Produto criado com sucesso!' })

    } catch (error) {
        log.magenta(error)
        res.status(500).json({ msg: 'Erro ao criar objeto, tente novamente' })
    }


})

app.get('/products', getUserId, async (req, res) => {
    try {
        const products = await Product.find({ userId: userId })
        res.json(products)
    } catch (error) {
        res.status(500).send('Erro ao obter os produtos: ' + error.message);
    }
})

app.put('/product/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const newDate = req.body.date;
        const newDescription = req.body.description;
        const newValue = req.body.value

        // Encontra o registro pelo ID e atualiza no banco de dados
        const produtoAtualizado = await Product.findByIdAndUpdate(id, { date: newDate, description: newDescription, value: newValue }, { new: true });

        res.json(produtoAtualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/product/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const produtoExcluido = await Product.findByIdAndDelete(id);

        if (!produtoExcluido) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        res.json({ message: 'Produto excluído com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
