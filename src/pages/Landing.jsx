import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.js";
import "./Landing.css";
import Add from "../img/addAvatar.png";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const Landing = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const [errReg, setErrReg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitReg = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.log(err);
            setErrReg(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErrReg(true);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };
  return (
    <div className="landCont">
      <Navbar />
      <div className="content">
        <div className="loginCont">
          <span className="titleLog">Login</span>
          <form onSubmit={handleSubmit}>
            <div className="emailLogin">
              <input type="email" className="inpBox" placeholder="email" />
              <input
                type="password"
                className="inpBox"
                placeholder="password"
              />
              <button className="signInBtn">Sign in</button>
              {err && <span>Something went wrong</span>}
            </div>
          </form>
          {/* <p>
            You don't have an account? <Link to="/register">Register</Link>
          </p> */}
        </div>
        <div className="registerCont">
          <span className="titleReg">Register</span>
          <form onSubmit={handleSubmitReg}>
            <div className="emailReg">
              <input
                required
                type="text"
                className="inpBox"
                placeholder="display name"
              />
              <input
                required
                type="email"
                className="inpBox"
                placeholder="email"
              />
              <input
                required
                type="password"
                className="inpBox"
                placeholder="password"
              />
              <input
                required
                style={{ display: "none" }}
                type="file"
                id="file"
              />
              <div className="addAvatarCont">
                <label htmlFor="file">
                  <img className="avatarImg" src={Add} alt="" />
                  <span className="avatarImgTxt">Add an avatar</span>
                </label>
              </div>
              <button className="signUpBtn" disabled={loading}>
                Sign up
              </button>
              {loading && "Uploading and compressing the image please wait..."}
              {errReg && <span>Something went wrong</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Landing;
