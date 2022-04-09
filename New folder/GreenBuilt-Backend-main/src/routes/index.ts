import { Application } from 'express'
import { isSignedIn, isValidToken, isCorporate } from './../middlewares/index'
import { authRoute, updateRoute } from './auth'
import { userRoute } from './user'
import { generateQRRoute, consumeQRRoute } from './qrCode'

export const routes = (app: Application) => {
	//normal routes
	app.use('/api', authRoute)

	//user routes
	app.use('/api', isSignedIn, isValidToken, updateRoute)
	app.use('/api', isSignedIn, isValidToken, userRoute)
	app.use('/api', isSignedIn, isValidToken, consumeQRRoute)

	//corporate routes
	app.use('/api', isSignedIn, isValidToken, isCorporate, generateQRRoute)

	return app
}
