import React, { useState } from "react";
import "../Navbar/Navbar.css";

const Navbar = () => {
  console.log("hello");
  const [click, setClick] = useState(false);
  function handleClick() {
    console.log(click);
    if (click === true) {
      setClick(false);
    } else {
      setClick(true);
    }
  }
  return (
    <div className="main">
      <header>
        <div className="logo">
          <h1 className="heading">Talkrr</h1>
          {/* LOGO HERE */}
        </div>
        {/* <nav>
          <ul class="nav__links">
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Tech Stack</a>
            </li>
            <li>
              <a href="#">Our Team</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </nav> */}
        <div className="sideComp">
          <div className="link-web">
            <a href="https://github.com/Manan-jn/Talkrr">
              <img
                className="github"
                src={require("../../img/github.png")}
                alt="hello"
              />
            </a>
          </div>
        </div>
        <button onClick={handleClick} className="menu cta">
          Menu
        </button>
      </header>
      <div
        id="mobile__menu"
        className={click ? "overlay--active overlay" : "overlay"}
      >
        <button onClick={handleClick}>
          <a class="close">&times;</a>
        </button>
        <div class="overlay__content">
          {/* <a href="#">About</a>
          <a href="#">Tech Stack</a>
          <a href="#">Our Team</a>
          <a href="#">Contact</a> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
