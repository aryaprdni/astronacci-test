import { Article } from "@prisma/client"

export type ArticleResponse = {
    id: number
    title: string
    content: string
}

export function toArticleResponse(article: Article): ArticleResponse {
    return {
        id: article.id,
        title: article.title,
        content: article.content
    }
}