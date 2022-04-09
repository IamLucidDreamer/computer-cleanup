import log4js from 'log4js'
const logger = log4js.getLogger()
logger.level = 'debug'

export const loggerUtil = (message: string, logType: string = 'INFO') => {
	logType === 'INFO' || logType === 'SERVER'
		? logger.info(message)
		: logType === 'ERROR'
		? logger.error(message)
		: null
}

export const log = (data: any) => {
	logger.debug(data)
}
