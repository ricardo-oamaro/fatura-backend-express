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

//DESTRUCTURE ENV VARIABLES WITH DEFAULT VALUES
const { PORT = 8000 } = process.env

// Create Application Object
const app = express()

const secret = process.env.SECRET

app.use(express.json())



app.get('/', (req, res) => {
    res.status(200).json('Bem vindo a API')
})

//Private Route
app.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id
    const user = await User.findById(id, '-passwd')
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado!' })
    res.status(200).json({ user })
})

app.post('/auth/signup', async (req, res) => {
    const { name, email, passwd, confirmpasswd } = req.body
    const userExist = await User.findOne({ email: email })

    if (!name) return res.status(422).json({ msg: 'O nome é obrigatório' })
    if (!email) return res.status(422).json({ msg: 'O email é obrigatório' })
    if (!passwd) return res.status(422).json({ msg: 'A senha é obrigatória' })
    if (passwd !== confirmpasswd) return res.status(422).json({ msg: 'As senhas não correspondem, tente novamente' })
    if (userExist) return res.status(422).json({ msg: 'Esse email já foi cadastado' })

    //Create Password
    const salt = await bcrypt.genSalt(12)
    const passwdHash = await bcrypt.hash(passwd, salt)

    //Create User
    const user = new User({
        name,
        email,
        passwd: passwdHash,
    })

    try {
        await user.save()
        res.status(201).json({ msg: 'Usuário criado com sucesso!' })

    } catch (error) {
        log.red(error)
        res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde' })
    }

})

app.post('/auth/login', async (req, res) => {

    const { email, passwd } = req.body
    const user = await User.findOne({ email: email })

    if (!email) return res.status(422).json({ msg: 'O email é obrigatório' })
    if (!passwd) return res.status(422).json({ msg: 'A senha é obrigatória' })
    if (!user) return res.status(404).json({ msg: 'E-mail não encontrado!' })

    const checkPwd = await bcrypt.compare(passwd, user.passwd)
    if (!checkPwd) return res.status(422).json({ msg: 'Senha Inválida!' })

    try {
        const token = jwt.sign({
            id: user.id,
        },
            secret, {
            expiresIn: 600
        }

        )
        res.status(200).json({ msg: 'Autenticação realizada com sucesso', token })

    } catch (error) {
        log.magenta(error)
        res.status(500).json({
            msg: 'Erro no servidor, tente novamente'
        })
    }
})

const dbUser = process.env.DB_USER
const dbPasswd = process.env.DB_PASSWD

mongoose.connect(`mongodb+srv://${dbUser}:${dbPasswd}@cluster0.adsrmpi.mongodb.net/`)
    .then(
        app.listen(PORT, () => log.green("SERVER STATUS", `Listening on port ${PORT}`))

    ).catch((err) => log.magenta(err))

const db = mongoose.connection;


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
