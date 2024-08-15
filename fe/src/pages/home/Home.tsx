import { Container, Card, Tabs, Tab, Button } from "react-bootstrap";
import useHome from "./hooks/useHome";
import useAuthStore from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const { articles, videos, loadingArticles, loadingVideos, error } = useHome();
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout(); 
        navigate('/login');
    }

    return (
        <Container className="mt-5">
            <Button variant="danger" onClick={handleLogout} className="mb-3">
                Logout
            </Button>
            <Tabs defaultActiveKey="article" id="home-tabs" className="mb-3">
                <Tab eventKey="article" title="Article">
                    <div className="p-3">
                        {loadingArticles && <p>Loading articles...</p>}
                        {error && <p>Error: {error}</p>}
                        {articles.map((article, index) => (
                            <Card key={index} className="mb-3">
                                <Card.Body>
                                    <Card.Title>{article.title}</Card.Title>
                                    <Card.Text>{article.content}</Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </Tab>
                <Tab eventKey="video" title="Video">
                    <div className="p-3">
                        {loadingVideos && <p>Loading videos...</p>}
                        {error && <p>Error: {error}</p>}
                        {videos.map((video, index) => (
                            <Card key={index} className="mb-3">
                                <Card.Body>
                                    <Card.Title>{video.title}</Card.Title>
                                    <Card.Text>{video.description}</Card.Text>
                                    <video controls width="100%">
                                        <source src={video.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default HomePage;
