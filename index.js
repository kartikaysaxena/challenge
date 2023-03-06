const express = require('express')
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const { ppid } = require('process');
const methodOverride = require('method-override')
const mongoModel = require('./models/mongo')
app.use(methodOverride('_method'))

app.use(express.urlencoded({extended:true}))
main().catch(err => console.log(err))

app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// app.use('/',async(req,res,next)=> {
//     const filters = req.query;
//     console.log(filters)
//     const items = await mongoModel.find(filters)
//     console.log(items)
//     if(items)
//     {
//         res.render('found',{items,filters})
//     }
//     else 
//     {
//         res.send('Not Found')
//     }
    
// })


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/CodeChallenge')
    .then(()=> {
        console.log('connected')
    })
    .catch(err => {
        console.log('Error !!!!!')
        console.log(err)
    });
}

const newDb = async() => {
    await mongoModel.deleteMany({})
    const data1= new mongoModel({
        name:'Shirt',
        price: 20,
        category:'fashion'
    })
    const data2= new mongoModel({
        name:'Watch',
        price: 50,
        category:'fashion'
    })
    await data1.save()
    await data2.save()
}
newDb()




app.get('/', async (req,res)=> {
    const items = await mongoModel.find({})
    res.render('home',{items})
})

app.get('/new',(req,res)=> {
    res.render('new')
})

app.post('/new',async (req,res) => {
    console.log(req.body)
    const newEntry = new mongoModel(req.body)
    await newEntry.save()
    res.redirect('/')
})

app.get('/:id', async (req,res)=> {
    const {id} = req.params;
    const entry = await mongoModel.findById(id)
    res.render('show',{entry})
})

app.get('/:id/edit', async(req,res)=> {
    const {id} = req.params;
    const entry = await mongoModel.findById(id)
    res.render('edit', {entry})
})

app.put('/:id', async(req,res)=> {
    const {id} = req.params
    console.log('puttttt')
    console.log(req.body)
    const entry = await mongoModel.findByIdAndUpdate(id,req.body)
    res.redirect(`/${entry._id}`)
})

app.delete('/:id', async(req,res)=> {
    const {id} = req.params
    await mongoModel.findByIdAndDelete(id)
    res.redirect('/')
})
app.post('/search', async(req,res)=> {
    const search = req.body;
    req.body.name = await req.body.name.toUpperCase()
    var filters = req.body;
    

    const items = await mongoModel.find(filters)
    console.log(items[0])
    if(items[0]===undefined)
    {
        res.render('not-found', {filters,search})

    }
    else
    {
        res.render('found',{items,filters,search})

    }
    
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})