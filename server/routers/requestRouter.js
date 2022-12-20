const Router = require( 'express' )
const router = new Router()
const requestController = require( '../controllers/requestController' )
const authMiddleware = require( '../middleware/authMiddleware' )


router.post( '/', authMiddleware, requestController.create )
router.get( '/', authMiddleware, requestController.get )
router.get( '/my', authMiddleware, requestController.getAllMy )
router.patch( '/:id', authMiddleware, requestController.update )

module.exports = router