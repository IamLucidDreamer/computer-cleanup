import { Response } from 'express'
import { prisma } from '../prisma/index'
import { loggerUtil as logger } from '../utils/logger'
import { statusCode as SC } from '../utils/statusCode'
import { v4 as uuid } from 'uuid'

interface Product {
	title: string
	description?: string
	points: number
	photo?: string
}

type totalPointsType = number | null | undefined

export const generateQRCode = async (req: any, res: Response): Promise<any> => {
	const userId = req.auth._id
	const products: Product[] = req.body.products
	const totalPoints: totalPointsType = products.reduce(
		(a, b): number => a + b.points,
		0
	)
	try {
		await prisma.user
			.findUnique({
				where: {
					id: userId
				}
			})
			.then(async user => {
				if (user?.points) {
					if (user?.points >= totalPoints) {
						await prisma.user
							.update({
								where: {
									id: user.id
								},
								data: {
									points: user?.points - totalPoints
								}
							})
							.then(async rs => {
								await prisma.qRCode
									.create({
										data: {
											userId,
											qrId: uuid(),
											products: {
												create: products
											}
										}
									})
									.then(data => {
										return res.status(SC.OK).json({
											message: 'QR Code Generated Successfully!',
											data: {
												...data,
												products,
												totalPoints,
												availableUserPoints: rs?.points
											}
										})
									})
									.catch(err => {
										logger(err, 'ERROR')
										return res.status(SC.BAD_REQUEST).json({
											error: 'Failed to generate QR Code!'
										})
									})
							})
							.catch(err => {
								logger(err, 'ERROR')
								return res.status(SC.BAD_REQUEST).json({
									error: 'Failed to generate QR Code!'
								})
							})
					} else {
						res.status(SC.BAD_REQUEST).json({
							error: 'Insufficient points to generate QR!',
							availablePoints: user?.points
						})
					}
				} else {
					res.status(SC.BAD_REQUEST).json({
						error: 'Insufficient points to generate QR!',
						availablePoints: user?.points
					})
				}
			})
	} catch (err: any) {
		logger(err, 'ERROR')
	} finally {
		logger(`Generate QR Code API Called!`)
	}
}

export const consumeQRCode = async (req: any, res: Response): Promise<any> => {
	const userId = req.auth._id
	const qrId: string = req.params.qrId
	try {
		await prisma.qRCode
			.findFirst({
				where: {
					qrId
				}
			})
			.then(data => {
				if (!data) {
					return res.status(SC.NOT_FOUND).json({
						message: 'No QR Found!'
					})
				}
				if (!data?.redeemed) {
					prisma.qRCode
						.update({
							where: {
								qrId
							},
							data: {
								redeemed: true
							}
						})
						.then(async () => {
							await prisma.usedQRCode
								.create({
									data: {
										qrId,
										userId
									}
								})
								.then(async data => {
									await prisma.product
										.findMany({
											where: {
												qrId
											}
										})
										.then(async products => {
											await prisma.product
												.updateMany({
													where: {
														qrId
													},
													data: {
														userId
													}
												})
												.then(async () => {
													await prisma.user
														.findUnique({
															where: {
																id: userId
															}
														})
														.then(async user => {
															let userPoints = 0
															if (user?.points) userPoints += user?.points

															const totalPoints: totalPointsType =
																products.reduce(
																	(a, b): number => a + b.points,
																	0
																)
															await prisma.user
																.update({
																	where: {
																		id: userId
																	},
																	data: {
																		points: userPoints + totalPoints
																	}
																})
																.then(rs => {
																	return res.status(SC.OK).json({
																		message: 'QR Code Consumed Successfully!',
																		data: {
																			...data,
																			products,
																			totalPoints,
																			availableUserPoints: rs?.points
																		}
																	})
																})
														})
												})
										})
										.catch(err => {
											logger(err, 'ERROR')
											return res.status(SC.BAD_REQUEST).json({
												error: 'Failed to consume QR Code!'
											})
										})
								})
								.catch(err => {
									logger(err, 'ERROR')
									return res.status(SC.BAD_REQUEST).json({
										error: 'Failed to consume QR Code!'
									})
								})
						})
					return
				} else {
					return res.status(SC.BAD_REQUEST).json({
						error: 'QR Code has been already used!'
					})
				}
			})
			.catch(err => {
				logger(err, 'ERROR')
				return res.status(SC.BAD_REQUEST).json({
					error: 'Consume QR Code API Failed!'
				})
			})
	} catch (err: any) {
		logger(err, 'ERROR')
	} finally {
		logger(`Consume QR Code API Called!`)
	}
}
