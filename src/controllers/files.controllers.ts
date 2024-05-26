import { Request, Response } from 'express'

import { FILES_MESSAGES } from '~/constants/message'
import fileService from '~/services/files.services'

export const uploadImageController = async (req: Request, res: Response) => {
  try {
    const result = await fileService.uploadImage(req)
    return res.json({
      message: FILES_MESSAGES.UPLOAD_IMAGE_SUCCESS,
      data: result
    })
  } catch (error) {
    console.log(error)
  }
}
