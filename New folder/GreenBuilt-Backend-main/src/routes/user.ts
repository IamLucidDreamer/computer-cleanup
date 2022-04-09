import express from 'express'
import { getUserById, getAllUsers } from '../controllers/user'

const userRoute = express.Router()

userRoute.get('/user/get/:userId', getUserById)
userRoute.get('/user/get-all', getAllUsers)

export { userRoute }
