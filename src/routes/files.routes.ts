import { Router } from 'express'

import { uploadImageController } from '~/controllers/files.controllers'
import { wrapRequestHandler } from '~/utils/handler'

const filesRouter = Router()

filesRouter.post('/upload-image', wrapRequestHandler(uploadImageController))

export default filesRouter
