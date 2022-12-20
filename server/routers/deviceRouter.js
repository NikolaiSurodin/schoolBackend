const Router = require( 'express' )
const router = new Router()
const deviceController = require( '../controllers/DeviceController' )


router.post( '/', deviceController.create )
router.get( '/', deviceController.getList )
router.get( '/:id', deviceController.getItem )

module.exports = router