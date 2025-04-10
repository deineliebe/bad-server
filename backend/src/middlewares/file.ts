import { faker } from '@faker-js/faker'
import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { extname, join } from 'path'
import fs from 'fs'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        const directoryForFilesPath = process.env.UPLOAD_PATH_TEMP
            ? `../public/${process.env.UPLOAD_PATH_TEMP}`
            : '../public'
        if (!fs.existsSync(directoryForFilesPath)) {
            fs.mkdirSync(directoryForFilesPath, { recursive: true })
        }
        cb(null, join(__dirname, directoryForFilesPath))
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        const newName = `${faker.string.uuid()}${extname(file.originalname)}`
        cb(null, newName)
    },
})

export const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

export const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg']

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!file || !file.mimetype || !types.includes(file.mimetype)) {
        return cb(null, false)
    }
    if (!allowedExtensions.includes(extname(file.originalname))) {
        return cb(null, false)
    }
    return cb(null, true)
}

export default multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
})
