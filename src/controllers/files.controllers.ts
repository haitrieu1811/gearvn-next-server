import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'

import { FILES_MESSAGES } from '~/constants/message'
import { FileIdReqParams } from '~/models/requests/File.requests'
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

export const deleteImageController = async (req: Request<FileIdReqParams>, res: Response) => {
  try {
    await fileService.deleteImage(new ObjectId(req.params.fileId))
    return res.json({
      message: FILES_MESSAGES.DELETE_IMAGE_SUCCESS
    })
  } catch (error) {
    console.log(error)
  }
}
