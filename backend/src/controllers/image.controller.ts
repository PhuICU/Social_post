import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import httpStatusCode from "~/constants/httpStatusCode";
import imagesService from "~/services/image.service";
import { ErrorWithMessage } from "~/utils/error";
import { responseError, responseSuccess } from "~/utils/response";
import env_config from "~/configs/env.config";
import { log } from "console";

cloudinary.config({
  cloud_name: env_config.CLOUDINARY.CLOUD_NAME,
  api_key: env_config.CLOUDINARY.API_KEY,
  api_secret: env_config.CLOUDINARY.API_SECRET,
});

// const uploadSingleImage = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
//   const img = fs.readFileSync(req.file?.path as string)
//   if (!img) {
//     throw new ErrorWithMessage({
//       message: 'No image provided',
//       status: httpStatusCode.BAD_REQUEST
//     })
//   }
//   const encodedImage = img.toString('base64')
//   const finalImage = {
//     contentType: req.file?.mimetype as string,
//     image: Buffer.from(encodedImage, 'base64')
//   }
//   const result = await imagesService.createImage(finalImage)
//   return responseSuccess(res, {
//     message: 'Image uploaded successfully',
//     data: result
//   })
// }
const uploadCloudinarySingleImage = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  if (!req.file) {
    throw new ErrorWithMessage({
      message: "No image file provided",
      status: httpStatusCode.BAD_REQUEST,
    });
  }

  try {
    const sign_image = await cloudinary.uploader.upload(req.file.path, {
      folder: "post-images",
    });

    const { user_id } = req.decoded_access_token as { user_id: string };

    const result = await imagesService.create({
      public_id: sign_image.public_id,
      url: sign_image.secure_url,
      poster_id: user_id, // Ensure poster_id is provided
    });

    const img = await imagesService.getbyId(result.insertedId.toString());

    if (!img) {
      throw new ErrorWithMessage({
        message: "Failed to retrieve uploaded image",
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }

    // Clean up temporary file
    try {
      fs.unlinkSync(req.file.path);
    } catch (error) {
      console.error("Error deleting temporary file:", error);
    }

    return responseSuccess(res, {
      message: "Image uploaded successfully",
      data: {
        url: img.url,
        public_id: img.public_id,
        _id: img._id,
        poster_id: img.poster_id,
      },
    });
  } catch (error: any) {
    // Clean up temporary file on error
    try {
      fs.unlinkSync(req.file.path);
    } catch (cleanupError) {
      console.error("Error deleting temporary file:", cleanupError);
    }

    if (error.message?.includes("Must supply api_key")) {
      throw new ErrorWithMessage({
        message:
          "Cloudinary configuration is missing. Please check your environment variables: CLOUD_NAME, API_KEY, API_SECRET",
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }

    throw new ErrorWithMessage({
      message: `Image upload failed: ${error.message || "Unknown error"}`,
      status: httpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
const uploadCloudinaryMultipleImages = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const files = req.files as Express.Multer.File[] | undefined;

  if (!files || files.length === 0) {
    throw new ErrorWithMessage({
      message: "No images provided",
      status: httpStatusCode.BAD_REQUEST,
    });
  }
  const { user_id } = req.decoded_access_token as { user_id: string };

  // Check if any files are missing
  const missingFiles = files.filter((file) => !file.path);
  if (missingFiles.length > 0) {
    throw new ErrorWithMessage({
      message: "Some image files are corrupted or missing",
      status: httpStatusCode.BAD_REQUEST,
    });
  }

  try {
    const uploadPromises = files.map(async (file) => {
      const sign_image = await cloudinary.uploader.upload(file.path, {
        folder: "post-images",
      });
      return imagesService.create({
        public_id: sign_image.public_id,
        url: sign_image.secure_url,
        poster_id: user_id, // Ensure poster_id is provided
      });
    });
    const results = await Promise.all(uploadPromises);
    const images = await Promise.all(
      results.map(async (result) => {
        return await imagesService.getbyId(result.insertedId.toString());
      })
    );

    // Clean up temporary files
    files.forEach((file) => {
      try {
        fs.unlinkSync(file.path);
      } catch (error) {
        console.error("Error deleting temporary file:", error);
      }
    });

    return responseSuccess(res, {
      message: "Images uploaded successfully",
      data: images,
    });
  } catch (error: any) {
    // Clean up temporary files on error
    files.forEach((file) => {
      try {
        fs.unlinkSync(file.path);
      } catch (cleanupError) {
        console.error("Error deleting temporary file:", cleanupError);
      }
    });

    throw new ErrorWithMessage({
      message: `Images upload failed: ${error.message || "Unknown error"}`,
      status: httpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
// const getImageById = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
//   const { id } = req.params
//   const image = await imagesService.getImageById(id)
//   if (!image) {
//     throw new ErrorWithMessage({
//       message: 'Image not found',
//       status: httpStatusCode.NOT_FOUND
//     })
//   }
//   res.setHeader('Content-Type', image.contentType)
//   res.send(image.image.buffer)
// }
// const uploadMultipleImages = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
//   const files = req.files as Express.Multer.File[]
//   if (!files || files.length === 0) {
//     throw new ErrorWithMessage({
//       message: 'No images provided',
//       status: httpStatusCode.BAD_REQUEST
//     })
//   }
//   const uploadPromises = files.map(async (file) => {
//     const img = fs.readFileSync(file.path)
//     const encodedImage = img.toString('base64')
//     const finalImage = {
//       contentType: file.mimetype,
//       image: Buffer.from(encodedImage, 'base64')
//     }
//     return imagesService.createImage(finalImage)
//   })
//   const results = await Promise.all(uploadPromises)
//   return responseSuccess(res, {
//     message: 'Images uploaded successfully',
//     data: results
//   })
// }
const getCloudinaryImageById = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { id } = req.params;
  const image = await imagesService.getbyId(id);
  if (!image) {
    throw new ErrorWithMessage({
      message: "Image not found",
      status: httpStatusCode.NOT_FOUND,
    });
  }
  return responseSuccess(res, {
    message: "Image found",
    data: image,
  });
};
const destroyImages = async (
  req: Request<
    ParamsDictionary,
    any,
    {
      destroyImages: string[]; // array of public_id
    },
    any
  >,
  res: Response
) => {
  const { destroyImages } = req.body;

  if (!destroyImages || destroyImages.length === 0) {
    return responseSuccess(res, {
      message: destroyImages
        ? "Không có hình để xóa"
        : "Vui lòng cung cấp thông tin destroyImages",
      data: null,
    });
  }

  try {
    // Dùng Promise.all để thực hiện song song các tác vụ xóa trên Cloudinary và database
    const results = await Promise.all(
      destroyImages.map(async (publicId) => {
        const [cloudinaryResult, dbResult] = await Promise.all([
          cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
          }),
          imagesService.deleteImageByPublicId(publicId),
        ]);
        // Kiểm tra kết quả từng tác vụ và trả về thông báo phù hợp
        return {
          publicId,
          cloudinary: cloudinaryResult,
          database: dbResult,
        };
      })
    );

    return responseSuccess(res, {
      message: "Xóa ảnh thành công", // Thông báo tổng quát hơn
      data: results, // Trả về chi tiết kết quả của từng hình ảnh
    });
  } catch (error) {
    console.error("Lỗi khi xóa ảnh:", error);
    return responseError(res, {
      statusCode: 500,
      message: "Internal Server Error",
    }); // Hoặc trả về lỗi cụ thể hơn
  }
};

const getImageByIdUser = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { id } = req.params;

  const image = await imagesService.getImageByIdUser(id);
  if (!image) {
    throw new ErrorWithMessage({
      message: "Image not found",
      status: httpStatusCode.NOT_FOUND,
    });
  }
  return responseSuccess(res, {
    message: "Image found",
    data: image,
  });
};

const uploadImageControllers = {
  getCloudinaryImageById,
  uploadCloudinarySingleImage,
  uploadCloudinaryMultipleImages,
  destroyImages,
  getImageByIdUser,
};
export default uploadImageControllers;
