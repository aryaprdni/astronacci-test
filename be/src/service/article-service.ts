import { PrismaClient } from "@prisma/client"
import { ArticleResponse, toArticleResponse } from "../model/article_model";

const prisma = new PrismaClient();
export class ArticleService {
    static async getArticles(user: string): Promise<ArticleResponse[]> {
        console.log("user", user)
        const userLogin = await prisma.user.findUnique({
            where: {
                email: user
            }
        })

        if (!userLogin) {
            throw new Error('User not found');
        }

        const membershipType = await prisma.membershipType.findUnique({
            where: { id: userLogin?.membershipTypeId }
        });

        let articleLimit: number | undefined;

        if (membershipType?.typeName === "A") {
            articleLimit = 3;
        } else if (membershipType?.typeName === "B") {
            articleLimit = 10;
        } else if (membershipType?.typeName === "C") {
            articleLimit = undefined;
        }

        const articles = await prisma.article.findMany({
            take: articleLimit,
        })

        const articleResposes = articles.map(article => toArticleResponse(article))
        return articleResposes
    }
}