const express = require( 'express' )
require( 'dotenv' ).config()
const sequlize = require( './bd' )
const fileUpload = require( 'express-fileupload' )
const models = require( './models/models' )
const cors = require( 'cors' )
const router = require( './routers/index' )
const errorHandler = require( './middleware/ErrorHandlingMiddleware' )
const path = require( 'path' )

const PORT = process.env.PORT || 5000
const app = express()
app.use( cors() )
app.use( express.json() )
app.use( express.static( path.resolve( __dirname, 'static' ) ) )
app.use( fileUpload( {} ) )

app.use( '/api', router )// указываем какой будет урл

//обработка ошибок конечная
app.use( errorHandler )
const start = async () => {
    try {
        await sequlize.authenticate()
        await sequlize.sync()
        app.listen( PORT, () => {
            console.log( `Server OK, port ${ PORT }, ok` )
        } )
    } catch ( err ) {
        console.log( err )
    }
}
start()