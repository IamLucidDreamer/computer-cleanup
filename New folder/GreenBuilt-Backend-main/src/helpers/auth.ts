import * as crypto from 'crypto'

export const hashPassword = (password: string, salt: string) => {
	if (!password) return ''
	try {
		return crypto.createHmac('sha256', salt).update(password).digest('hex')
	} catch (err) {
		return ''
	}
}

export const authenticate = (
	password: string,
	salt: string,
	encryptedPassword: string
) => {
	return hashPassword(password, salt) === encryptedPassword
}
