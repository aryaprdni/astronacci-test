import { Video } from "@prisma/client"

export type VideoResponse = {
    id: number,
    title: string,
    url: string
}

export function toVideoResponse(video: Video): VideoResponse {
    return {
        id: video.id,
        title: video.title,
        url: video.url
    }
}