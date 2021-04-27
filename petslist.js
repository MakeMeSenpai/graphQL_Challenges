require("dotenv").config
const fetch = require('node-fetch');
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const cors = require('cors')


const schema = buildSchema(`
  type Pet {
    name: String!
    species: String!
  }

  type Mutation {
    addPet(name: String!, species: String!): Pet!
  }`)

const root = {
  addPet: ({ name, species }) => {
		const pet = { name, species }
		petList.push(pet)
		return pet
	}
}

// Create an express app
const app = express()
app.use(cors())

// Define a route for GraphQL
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  }))

// Start this app
const port = 4000
app.listen(port, () => {
  console.log('Running on port:'+port)
})
