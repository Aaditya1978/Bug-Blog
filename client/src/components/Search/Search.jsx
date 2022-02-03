import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BallTriangle } from "react-loader-spinner";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import "./Search.css";

export default function Search() {
  const navigate = useNavigate();

  const { query } = useParams();

  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/user/search/${query}`)
      .then((res) => {
        setBlogs(res.data.blogs);
        setInterval(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setInterval(() => {
          setLoading(false);
        }, 1000);
      });
  }, [query]);

  const handlePost = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
    <>
      <NavBar />
      <div className="search-container">
        <h1 className="main-heading">Results For Your Search</h1>
        { loading ? (
        <div className="loader">
          <BallTriangle
            radius="4px"
            color="#8b39bb"
            ariaLabel="loading-indicator"
          />
        </div>
        ) : (
        <Container>
          {blogs.length > 0 ? (
            blogs.reverse().map((blog) => {
              return (
                <Card
                  className="blog-card"
                  key={blog._id}
                  onClick={() => {
                    handlePost(blog._id);
                  }}
                >
                  {blog.cloudinaryId ? (
                    <Card.Img variant="top" src={blog.image} />
                  ) : null}
                  <Card.Body>
                    <h1>{blog.title}</h1>
                    <div className="blog-info">{blog.author}</div>
                    <div className="blog-info">
                      {new Date(blog.created_at).toDateString()}
                    </div>
                    <div className="blog-items">
                      <span>
                        <AiOutlineHeart /> {blog.likes.length} Reactions
                      </span>
                      <span>
                        <FaRegComment /> {blog.comments.length} Comments
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              );
            })
          ) : (
            <>
              <h1>No Blogs for given search</h1>
            </>
          )}
        </Container>
        )}
      </div>
      <Footer />
    </>
  );
}
