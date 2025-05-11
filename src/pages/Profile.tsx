
import React from "react";
import { Navigate } from "react-router-dom";

const Profile = () => {
  // This component is now just a redirect to the /profile route which uses AccountLayout
  return <Navigate to="/profile" replace />;
};

export default Profile;
