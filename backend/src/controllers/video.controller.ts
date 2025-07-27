import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { ParamsDictionary } from "express-serve-static-core";
import env_config from "~/configs/env.config";
import videosService from "~/services/video.service";
import { responseError, responseSuccess } from "~/utils/response";
import { ErrorWithMessage } from "~/utils/error";
import httpStatusCode from "~/constants/httpStatusCode";

cloudinary.config({
  cloud_name: env_config.CLOUDINARY.CLOUD_NAME,
  api_key: env_config.CLOUDINARY.API_KEY,
  api_secret: env_config.CLOUDINARY.API_SECRET,
});
const createVideo = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const sign_video = await cloudinary.uploader.upload(
    req.file?.path as string,
    {
      resource_type: "video",
      folder: "dxmt-videos",
      format: "mp4",
      transformation: [{ width: 1280, height: 720, crop: "limit" }],
      // dung luong toi da cho phep la 100MB
      max_file_size: 100000000,
    }
  );
  const video = await videosService.create({
    public_id: sign_video.public_id,
    video_url: sign_video.secure_url,
  });
  return responseSuccess(res, {
    message: "Video uploaded successfully",
    data: video,
  });
};
const uploadMutipleVideos = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    throw new ErrorWithMessage({
      message: "No videos provided",
      status: httpStatusCode.BAD_REQUEST,
    });
  }
  const uploadPromises = files.map(async (file) => {
    const sign_video = await cloudinary.uploader.upload(file.path, {
      folder: "dxmt-images",
      resource_type: "video",
      format: "mp4",
      transformation: [{ width: 1280, height: 720, crop: "limit" }],
      max_file_size: 100000000,
    });
    return videosService.create({
      public_id: sign_video.public_id,
      video_url: sign_video.secure_url,
    });
  });
  const results = await Promise.all(uploadPromises);
  const videos = results.map(async (result) => {
    return await videosService.getbyId(result.insertedId.toString());
  });
  return responseSuccess(res, {
    message: "Videos uploaded successfully",
    data: await Promise.all(videos),
  });
};
const destroyVideos = async (
  req: Request<
    ParamsDictionary,
    any,
    {
      destroyVideos: string[]; // array of public_id
    },
    any
  >,
  res: Response
) => {
  const { destroyVideos } = req.body;

  if (!destroyVideos || destroyVideos.length === 0) {
    return responseSuccess(res, {
      message: destroyVideos
        ? "Không có hình để xóa"
        : "Vui lòng cung cấp thông tin destroyVideos",
      data: null,
    });
  }

  try {
    // Dùng Promise.all để thực hiện song song các tác vụ xóa trên Cloudinary và database
    const results = await Promise.all(
      destroyVideos.map(async (publicId) => {
        const [cloudinaryResult, dbResult] = await Promise.all([
          cloudinary.uploader.destroy(publicId, {
            resource_type: "video",
          }),
          videosService.deleteVideoByPublicId(publicId),
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
      message: "Xóa videos thành công", // Thông báo tổng quát hơn
      data: results, // Trả về chi tiết kết quả của từng hình videos
    });
  } catch (error) {
    console.error("Lỗi khi xóa videos:", error);
    return responseError(res, {
      statusCode: 500,
      message: "Internal Server Error",
    }); // Hoặc trả về lỗi cụ thể hơn
  }
};

const videosControllers = {
  createVideo,
  uploadMutipleVideos,
  destroyVideos,
};
export default videosControllers;
