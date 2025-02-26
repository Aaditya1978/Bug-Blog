import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BallTriangle } from "react-loader-spinner";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import Pagination from "./Pagination/Pagination";
import "./Home.css";
import Footer from "../Footer/Footer";

export default function Home() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetching the blog posts
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/user/posts`)
      .then((res) => {
        // Log the response to check the structure
        console.log("API Response:", res.data);
        setBlogs(res.data.blogs);
        const totalBlogs = res.data.blogs.length;
        console.log("Total Blogs:", totalBlogs);
        setTotalPages(Math.ceil(totalBlogs / 3)); // Set total pages based on 3 blogs per page
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handlePost = (id) => {
    navigate(`/blog/${id}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <NavBar />
      <div className="home-container">
        <h1 className="main-heading">Recent Blogs</h1>
        {loading ? (
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
              // Slice the blogs to display 3 per page
              blogs.slice((currentPage - 1) * 3, currentPage * 3).map((blog) => {
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
                <h1>No Blogs Available</h1>
                <p>Write Your own Blog !!</p>
              </>
            )}
          </Container>
        )}
        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Footer />
    </>
  );
}
