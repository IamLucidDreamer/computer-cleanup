import express from 'express'
import { generateQRCode, consumeQRCode } from '../controllers/qrCode'

const generateQRRoute = express.Router(),
	consumeQRRoute = express.Router()

generateQRRoute.post('/qr/generate', generateQRCode)
consumeQRRoute.post('/qr/consume/:qrId', consumeQRCode)

export { generateQRRoute, consumeQRRoute }
