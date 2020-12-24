import React, { useState, useEffect } from "react";
import "./modal.css";
import axios from "axios";

const Modal = ({
  modal,
  setModal,
  update,
  setPasswordList,
  passwordList,
  setUpdate,
}) => {
  const [newPassword, setNewPassword] = useState({
    title: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setNewPassword({ ...newPassword, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (update) {
      setNewPassword({
        title: update.title,
        username: update.username,
        password: update.password,
      });
    }
  }, [update]);

  // Save data to DB
  const saveData = async () => {
    try {
      const response = await axios.post("/add", newPassword);
      console.log(response);
    } catch (error) {
      const err = error.response.data;
      console.log(err);
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!update) {
      console.log("updating");
      setPasswordList([...passwordList, newPassword]);
      saveData();
      console.log("passowrd saved");
      setModal(!modal);
      setNewPassword({ title: "", username: "", password: "" });
    } else {
      // updating local object
      passwordList.forEach((oldPassword) => {
        if (oldPassword._id === update._id) {
          oldPassword.title = newPassword.title;
          oldPassword.username = newPassword.username;
          oldPassword.password = newPassword.password;
        }
      });
      try {
        const response = await axios.post("/update", {
          id: update._id,
          title: newPassword.title,
          username: newPassword.username,
          password: newPassword.password,
        });
        console.log(response);
        setModal(!modal);
        setNewPassword({ title: "", username: "", password: "" });
      } catch (error) {
        const err = error.response.data;
        console.log(err);
      }
    }
  };

  // Close modal
  const closeModal = () => {
    setModal(!modal);
    setNewPassword({ title: "", username: "", password: "" });
    setUpdate("");
  };

  return (
    <div className="modal__container">
      <div className="modal__header">
        <h3>{update ? "Update Details" : "Add More Passwords"}</h3>
        <i className="fas fa-times" onClick={closeModal}></i>
      </div>
      <div className="modal__body">
        <form className="form__control" onSubmit={handleSubmit}>
          <input
            name="title"
            className="modal__input"
            type="text"
            placeholder="Title"
            value={newPassword.title}
            onChange={handleChange}
          />
          <input
            name="username"
            className="modal__input"
            type="text"
            value={newPassword.username}
            placeholder="Username"
            onChange={handleChange}
          />
          <input
            name="password"
            className="modal__input"
            type="password"
            value={newPassword.password}
            placeholder="Password"
            onChange={handleChange}
          />
          <button className="add__password" type="submit">
            Add Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
