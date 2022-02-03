import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, ListGroup, Button } from "react-bootstrap";
import Identicon from "react-identicons";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BallTriangle } from "react-loader-spinner";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [likedBlogs, setLikedBlogs] = useState([]);
  const [isBlog, setIsBlog] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/api/user/profile`, {
          token: localStorage.getItem("token"),
        })
        .then((res) => {
          setName(res.data.name);
          setEmail(res.data.email);
          setBlogs(res.data.blogs);
          setLikedBlogs(res.data.likedBlogs);
          setInterval(() => {
            setLoading(false);
          }, 1000);
        })
        .catch((err) => {
          setInterval(() => {
            setLoading(false);
          }, 1000);
          navigate("/login");
        });
    } else {
      setInterval(() => {
        setLoading(false);
      }, 1000);
      navigate("/login");
    }
  }, [navigate, setName, setEmail, setBlogs, setLikedBlogs]);

  const handlePost = (id) => {
    navigate(`/blog/${id}`);
  };

  const handleDelete = (id) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/user/delete`, {
        token: localStorage.getItem("token"),
        id: id,
      })
      .then((res) => {
        setBlogs(res.data.blogs);
        setLikedBlogs(res.data.likedBlogs);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <>
      <NavBar />
      <div className="profile-container">
        <div className="profle-card">
          <Card>
            <Card.Header>Basic Profile</Card.Header>
            <Card.Body>
              <div className="basic-profile">
                <Identicon className="user-icon" string={email} size={85} />
                <div>
                  <h1>{name}</h1>
                  <div className="user-email">{email}</div>
                  <div className="user-info">
                    Blogs Published - {blogs.length}
                  </div>
                </div>
              </div>
              <ListGroup>
                <ListGroup.Item
                  className={`${isBlog ? "active" : ""}`}
                  onClick={() => {
                    setIsBlog(true);
                  }}
                >
                  Your Blogs <span>{blogs.length}</span>
                </ListGroup.Item>
                <ListGroup.Item
                  className={`${!isBlog ? "active" : ""}`}
                  onClick={() => {
                    setIsBlog(false);
                  }}
                >
                  Liked Blogs <span>{likedBlogs.length}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
        {loading ? (
          <div className="loader">
            <BallTriangle
              radius="4px"
              color="#8b39bb"
              ariaLabel="loading-indicator"
            />
          </div>
        ) : (
          <div className="profile-blogs">
            {isBlog ? (
              <>
                <h1 className="main-heading">Your Blogs</h1>
                <div>
                  {blogs.map((blog) => {
                    return (
                      <Card className="blog-card" key={blog._id}>
                        {blog.cloudinaryId ? (
                          <Card.Img variant="top" src={blog.image} />
                        ) : null}
                        <Card.Body>
                          <h1
                            onClick={() => {
                              handlePost(blog._id);
                            }}
                          >
                            {blog.title}
                          </h1>
                          <div className="blog-info">{blog.author}</div>
                          <div className="blog-info">
                            {new Date(blog.created_at).toDateString()}
                          </div>
                          <div className="blog-items">
                            <div>
                              <span>
                                <AiOutlineHeart /> {blog.likes.length} Reactions
                              </span>
                              <span>
                                <FaRegComment /> {blog.comments.length} Comments
                              </span>
                            </div>
                            <div>
                              <Button
                                className="edit-button"
                                variant="info"
                                onClick={() => {
                                  handleEdit(blog._id);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                className="edit-button"
                                variant="danger"
                                onClick={() => {
                                  handleDelete(blog._id);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <h1 className="main-heading">Liked Blogs</h1>
                <div>
                  {likedBlogs.map((blog) => {
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
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
