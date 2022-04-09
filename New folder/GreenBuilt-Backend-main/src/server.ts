/**
 * @author krish
 */

import express, { Application } from 'express'
import { validationResult } from 'express-validator'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './docs/swagger-ui.json'
import { loggerUtil as logger } from './utils/logger'
import { statusCode as SC } from './utils/statusCode'

//routes
import { routes } from './routes/index'

dotenv.config()
const app: Application = express()

//built-in middlewares
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cors({ credentials: true }))
app.use(morgan('dev'))
app.get('/hello', (req, res) => res.send("HELLO"))

//validate req
app.use((req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		res.status(SC.WRONG_ENTITY).json({ error: errors.array() })
	}
	next()
})

//routes goes here
routes(app)
app.get('/hello', (req, res) => res.send("HELLO"))

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

//connection
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
	logger(`Listening on port ${PORT}`, 'SERVER')
})

