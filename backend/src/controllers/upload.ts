import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import BadRequestError from '../errors/bad-request-error'
import file, { allowedExtensions, types } from '../middlewares/file'
import { extname } from 'path'
import { faker } from '@faker-js/faker'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file || !req.file.path) {
        return next(new BadRequestError('Файл не загружен'))
    }
    try {
        if (!req.file?.mimetype || !types.includes(req.file.mimetype)) {
            return next(
                new BadRequestError(
                    'Можно загружать только файлы в форматах: png, jpg, jpeg, gif и svg'
                )
            )
        }
        const fileExtension = extname(req?.file?.originalname).toLowerCase()
        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            return next(new BadRequestError('Недопустимый формат файла'))
        }
        if (req.file?.size < 2000) {
            return next(new BadRequestError('Слишком небольшой размер файла'))
        }
        const newFileName = `${faker.string.uuid()}${extname(req.file?.originalname)}`
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${newFileName}`
            : `/${newFileName}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: newFileName,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
