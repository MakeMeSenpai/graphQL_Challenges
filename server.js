require("dotenv").config
const API_KEY = process.env.API_KEY
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const schema = buildSchema(`
# schema here
type Test {
	message: String!
}
`)

const root = {
	// resolvers here
}

// Create an express app
const app = express()

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

const weather = `http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${API_KEY}`