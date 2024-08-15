import { PrismaClient } from "@prisma/client"
import { toVideoResponse, VideoResponse } from "../model/video_model"
import { toUserResponse } from "../model/user_model";

const prisma = new PrismaClient();

export class VideoService {
    static async getVideos(user: string): Promise<VideoResponse[]> {
        const userLogin = await prisma.user.findUnique({
            where: {
                email: user
            }
        })
        const membershipType = await prisma.membershipType.findUnique({
            where: {
                id: userLogin?.membershipTypeId
            }
        })

        let videoLimit: number | undefined;
        if (membershipType?.typeName === "A") {
            videoLimit = 3;
        } else if (membershipType?.typeName === "B") {
            videoLimit = 10;
        } else if (membershipType?.typeName === "C") {
            videoLimit = undefined;
        }

        const videos = await prisma.video.findMany({
            take: videoLimit
        })

        const videoResposes = videos.map(video => toVideoResponse(video))

        return videoResposes
    }
}