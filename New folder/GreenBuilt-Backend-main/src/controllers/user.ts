import { Request, Response } from 'express'
import { prisma } from '../prisma/index'
import { loggerUtil as logger, log } from '../utils/logger'
import { statusCode as SC } from '../utils/statusCode'

export const getUserById = async (
	req: Request,
	res: Response
): Promise<any> => {
	const id = parseInt(req.params.userId || '1')
	try {
		await prisma.user
			.findFirst({
				where: {
					id: id
				}
			})
			.then(user => {
				if (!user) {
					return res.status(SC.NOT_FOUND).json({
						error: "User doesn't exist in DB!"
					})
				}
				return res.status(SC.OK).json({
					message: 'User fetched Successfully!',
					user
				})
			})
			.catch(err => {
				logger(err, 'ERROR')
				return res.status(SC.INTERNAL_SERVER_ERROR).json({
					message: 'Failed to fetch the user!'
				})
			})
	} catch (err: any) {
		logger(err, 'ERROR')
	} finally {
		logger(`Get User By Id API Called!`)
	}
}

export const getAllUsers = async (_: any, res: Response): Promise<any> => {
	try {
		await prisma.user
			.findMany()
			.then(user => {
				if (!user?.length) {
					return res.status(SC.NOT_FOUND).json({
						error: "User doesn't exist in DB!"
					})
				}
				log(user)
				return res.status(SC.OK).json({
					message: 'User fetched Successfully!',
					user
				})
			})
			.catch(err => {
				logger(err, 'ERROR')
				return res.status(SC.INTERNAL_SERVER_ERROR).json({
					message: 'Failed to fetch the user!'
				})
			})
	} catch (err: any) {
		logger(err, 'ERROR')
	} finally {
		logger(`Get All User API Called!`)
	}
}
