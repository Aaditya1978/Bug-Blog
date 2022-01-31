import React from "react";
import { Container } from "react-bootstrap";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        <h3>BugBlog</h3>
        A constructive and inclusive social network for software developers.
        With you every step of your journey.
        <br />
        Made with love and{" "}
        <a
          href="https://reactjs.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          React
        </a>
        . BugBlog Community © 2022.
      </Container>
    </footer>
  );
}
