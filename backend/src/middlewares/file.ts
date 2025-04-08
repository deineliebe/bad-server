import { faker } from '@faker-js/faker'
import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path, { extname, join } from 'path'
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
        cb(null, `${faker.string.uuid()}${extname(file.originalname)}`)
    },
})

export const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = async (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }
    if (
        !['.jpg', '.jpeg', '.png', 'gif', 'svg'].includes(
            extname(file.originalname)
        )
    ) {
        return cb(null, false)
    }
    if (
        req.headers['content-length'] &&
        Number(req.headers['content-length']) <= 2000
    ) {
        return cb(null, false)
    }
    return cb(null, true)
}

export default multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10485760,
    },
})
