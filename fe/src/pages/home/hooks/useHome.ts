/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { APIWithToken } from "../../../libs/axios";

const useHome = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [loadingArticles, setLoadingArticles] = useState<boolean>(true);
    const [loadingVideos, setLoadingVideos] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await APIWithToken.get("/articles");
                setArticles(response.data.data);
                setLoadingArticles(false);
            } catch (error: any) {
                console.error("Error getting articles", error);
                setError("Failed to fetch articles");
                setLoadingArticles(false);
            }
        };

        const fetchVideos = async () => {
            try {
                const response = await APIWithToken.get("/videos");
                setVideos(response.data.data);
                setLoadingVideos(false);
            } catch (error: any) {
                console.error("Error getting videos", error);
                setError("Failed to fetch videos");
                setLoadingVideos(false);
            }
        };

        fetchArticles();
        fetchVideos();
    }, []);

    return { articles, videos, loadingArticles, loadingVideos, error };
};

export default useHome;
