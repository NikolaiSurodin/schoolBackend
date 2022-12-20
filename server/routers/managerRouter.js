const Router = require( 'express' )
const router = new Router()

const authMiddleware = require( '../middleware/authMiddleware' )

const managerController = require( '../controllers/managerController' )
const checkRole = require('../middleware/checkRoleMiddleware')


router.get( '/', authMiddleware, managerController.get )
router.post( '/', checkRole('ADMIN'), managerController.create )

module.exports = router