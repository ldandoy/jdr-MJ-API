import mongoose from 'mongoose'

const URI = process.env.MONGODB_URL

mongoose.connect(`${URI}`, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error) => {
    if(error) throw error
    console.log('Mongodb connected !')
})