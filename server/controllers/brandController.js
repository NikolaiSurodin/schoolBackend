const { Brand } = require( '../models/models' )

class BrandController {
    async get( req, res ) {
        const brands = await Brand.findAll()
        return res.json( brands )
    }
    async create( req, res ) {
        const { name } = req.body
        const type = await Brand.create( { name } )
        return res.json( type )
    }
}
module.exports = new BrandController()