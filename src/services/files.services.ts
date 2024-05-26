import { Request } from 'express'
import fsPromise from 'fs/promises'
import mime from 'mime-types'
import path from 'path'
import sharp from 'sharp'

import { ENV_CONFIG } from '~/constants/config'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { FileType } from '~/constants/enum'
import File from '~/models/databases/File.database'
import databaseService from '~/services/database.services'
import { getNameFromFullName, handleUploadImage } from '~/utils/file'
import { uploadFileToS3 } from '~/utils/s3'

class FileService {
  async uploadImage(req: Request) {
    const images = await handleUploadImage(req)
    const result = await Promise.all(
      images.map(async (image) => {
        const newName = getNameFromFullName(image.newFilename)
        const newFullName = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullName)
        if (!image.filepath.includes('.jpg')) {
          await sharp(image.filepath).jpeg().toFile(newPath)
        }
        const [s3Result, { insertedId: addedImageId }] = await Promise.all([
          uploadFileToS3({
            filename: `images/${newFullName}`,
            filepath: newPath,
            contentType: mime.lookup(newPath) as string
          }),
          databaseService.files.insertOne(
            new File({
              name: newFullName,
              type: FileType.Image
            })
          )
        ])
        const addedImage = await databaseService.files.findOne({ _id: addedImageId })
        try {
          await Promise.all([fsPromise.unlink(image.filepath), fsPromise.unlink(newPath)])
        } catch (error) {
          console.log(error)
        }
        return {
          _id: (addedImage as File)._id,
          name: newFullName,
          url: `${ENV_CONFIG.HOST}/${ENV_CONFIG.STATIC_IMAGES_PATH}/${newFullName}`
        }
      })
    )
    return {
      images: result
    }
  }
}

const fileService = new FileService()
export default fileService
