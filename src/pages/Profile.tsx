
import React from "react";
import { Navigate } from "react-router-dom";

const Profile = () => {
  // Redirect to the account page
  return <Navigate to="/profile" replace />;
};

export default Profile;
