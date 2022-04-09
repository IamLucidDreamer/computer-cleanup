export interface IStatusCode {
	OK: number
	INTERNAL_SERVER_ERROR: number
	NOT_FOUND: number
	BAD_REQUEST: number
	WRONG_ENTITY: number
	UNAUTHORIZED: number
	FORBIDDEN: number
}

export const statusCode: IStatusCode = {
	OK: 200,
	INTERNAL_SERVER_ERROR: 500,
	NOT_FOUND: 404,
	BAD_REQUEST: 400,
	WRONG_ENTITY: 422,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403
}
