import express from 'express'
import { check } from 'express-validator'
import { signin, signup, signout, update } from '../controllers/auth'

const authRoute = express.Router(),
	updateRoute = express.Router()

authRoute.post(
	'/signup',
	[
		check('name')
			.isLength({
				min: 3
			})
			.withMessage('Please provide a name'),
		check('email').isEmail().withMessage('Please provide a valid E-Mail!'),
		check('password')
			.isLength({ min: 6 })
			.withMessage('Password length should be minimum of 8 characters')
	],
	signup
)

authRoute.post(
	'/signin',
	[
		check('email').isEmail().withMessage('Please provide a valid E-Mail!'),
		check('password')
			.isLength({ min: 6 })
			.withMessage('Password length should be minimum of 8 characters')
	],
	signin
)

authRoute.get('/signout', signout)

updateRoute.put('/update/:userId', update)

export { authRoute, updateRoute }
