const mongoose = require("mongoose")

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

mongoose.connect(url, {dbName: 'phonebook'})
  .then(res => console.log("connected successfully"))
  .catch(err => console.log("An error has occurred trying to connect to db", err.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /^[0-9]{2,3}-\d{1,}$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)