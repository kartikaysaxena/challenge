const express = require('express')
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const { ppid } = require('process');
const methodOverride = require('method-override')
const mongoModel = require('./models/mongo');
const { type } = require('express/lib/response');
app.use(methodOverride('_method'))

app.use(express.urlencoded({extended:true}))
main().catch(err => console.log(err))

app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


async function main() {
   
    await mongoose.connect('mongodb://127.0.0.1:27017/testd')
    .then(async ()=> {

        console.log('connected')
    })
    .catch(()=> {
        console.log('err')
    })
    
}
app.get('/', async(req,res)=> {

    const items = await mongoModel.find({})
    var found_names = []
    for (let i=0;i<items.length;i++) 
    {
        found_names.push(items[i].name)
    }
    const annotations = []
    for (let i=0;i<items.length;i++)
    {
        for (let j=0;j<items[i].annotation.length;j++)
        {
            annotations.push(items[i].annotation[j])
        }
    }
    console.log(annotations)

    console.log(found_names)
    res.render('home',{items,found_names,annotations})

})

app.get('/new',(req,res)=> {
    res.render('form')
})
app.post('/new',async (req,res)=> {
    console.log(req.body)
    const d = new Date();
    let month = months[d.getMonth()];

    req.body.date = d.getDate() + " " + month + " " + d.getFullYear();
    console.log(req.body)
    req.body.annotation.toUpperCase()

    req.body.annotation = req.body.annotation.toUpperCase()
    console.log(req.body.annotation)
    const newEntry = new mongoModel(req.body)
    await newEntry.save()
    res.redirect('/')

})

app.get('/:id', async (req,res)=> {
    const {id} = req.params;
    const entry = await mongoModel.findById(id)
    const length = entry.annotation.length;
    res.render('show',{entry,length})
})
app.delete('/:id',async(req,res)=> {
    const {id} = req.params
    const k = await mongoModel.findById(id)
    await mongoModel.findByIdAndDelete(id)
    console.log(k)
    console.log('deleted')
    res.redirect('/')
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

app.get('/:id/add',async (req,res)=> {
    const {id} = req.params
    const found = await mongoModel.findById(id)
    res.render('add',{found})
})
app.post('/:id/add',async(req,res)=> {
    const {id} = req.params
    console.log('puttttt')
    console.log(req.body)

    var entry = await mongoModel.findById(id)
    req.body.annotation = req.body.annotation.toUpperCase()
   
    entry.annotation.push(req.body.annotation)

    entry.size.push(req.body.size)
    const length = entry.annotation.length;
    const d = new Date();
    let month = months[d.getMonth()];

    entry.date.push(d.getDate() + " " + month + " " + d.getFullYear());


    console.log(entry)
    await mongoModel.findByIdAndUpdate(id,entry)
    entry = await mongoModel.findById(id)

    res.redirect(`/${entry._id}`)
})
app.post('/:id/del',async (req,res)=> {
    const {id} = req.params
    console.log(req.body)
    var entry = await mongoModel.findById(id)
    console.log(entry)
    console.log(Number(req.body.topic))
    entry.annotation.splice(Number(req.body.topic),1)
    entry.size.splice(Number(req.body.topic),1)
    entry.date.splice(Number(req.body.topic),1)
    
    console.log(entry)
    await mongoModel.findByIdAndUpdate(id,entry)
    console.log('yayyyyyy')
    res.redirect(`/${entry._id}`)
})

app.post('/search', async(req,res)=> {
    const search = req.body;
    req.body.name = await req.body.name.toUpperCase()
    var filters = req.body;
    console.log(filters)

    if (filters.type==='annotation')
    {
        console.log('in')
        const str = filters.name
        const items_new = await mongoModel.find({annotation:str})
        console.log(items_new)
        const len = items_new.length
        if(items_new[0]===undefined)
        {
 
            res.render('not-found-ann', {filters,search})
    
        }
        else
        {  
            let index = []
            for (let i=0;i<len;i++)
            {
                console.log('in')
                index.push(items_new[i].annotation.indexOf(filters.name))
                items_new[i].index = items_new[i].annotation.indexOf(filters.name)
            }
            console.log(index)
            console.log(items_new)

            // const index = items_new[0].annotation.indexOf(Number(filters.name))
            console.log(index)
            res.render('found-ann',{items_new,filters,search,index,len})
    
        }
    }
    else if(filters.type==='name')
    {
        console.log('in again')
        const items = await mongoModel.find({name:filters.name})
        console.log(items)
        if(items[0]===undefined)
        {
            res.render('not-found', {filters,search})
    
        }
        else
        {
            res.render('found',{items,filters,search})
    
        }
    }

    
    // console.log(filters)
    // console.log(typeof(Number(filters)))

    // console.log(items_new)
    // console.log(items[0])


  
   
    
})

// app.put('/:id', async(req,res)=> {
//     const {id} = req.params
//     console.log('puttttt')
//     console.log(req.body)

//     var entry = await mongoModel.findById(id)
//     req.body.annotation = Number(req.body.annotation)
//     entry.annotation.push(req.body.annotation)

//     console.log(entry)

//     res.redirect(`/${entry._id}`)
// })






app.listen(3000, ()=> {
    console.log('LISTENING ON PORT 3000')
})