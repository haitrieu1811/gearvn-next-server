import { Router } from 'express'

import { deleteImageController, uploadImageController } from '~/controllers/files.controllers'
import { fileIdValidator } from '~/middlewares/files.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const filesRouter = Router()

filesRouter.post('/upload-image', wrapRequestHandler(uploadImageController))

filesRouter.delete('/image/:fileId', fileIdValidator, wrapRequestHandler(deleteImageController))

export default filesRouter
