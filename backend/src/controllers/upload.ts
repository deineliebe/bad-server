import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import BadRequestError from '../errors/bad-request-error'
import { allowedExtentions, types } from '../middlewares/file'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file || !req.file.path) {
        return next(new BadRequestError('Файл не загружен'))
    }
    try {
        if (!req.file.mimetype || !types.includes(req.file.mimetype) ) {
            return next(new BadRequestError('Можно загружать только файлы в форматах: png, jpg, jpeg, gif и svg+xml'))
        }
        if (
            !req.file.originalname || !extname(!req.file.originalname) || !allowedExtentions.includes(
                extname(!req.file.originalname).toLowerCase()
            )
        ) {
            return next(new BadRequestError('Недопустимый формат файла'));
        }
        if (
            !req.headers['content-length'] ||
            Number(req.headers['content-length']) <= 2000
        ) {
            return next(new BadRequestError('Слишком небольшой размер файла'));
        }
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
function extname(arg0: boolean) {
    throw new Error('Function not implemented.')
}

