import React from "react";
import { Link } from "react-router-dom";
import { JhuniIcon } from "../components/icons";

export const Footer = () => {
  return (
    <footer className="w-full flex items-center justify-center py-3  fixed bottom-0 left-0 ">
      {/* <footer className="w-full flex items-center justify-center py-3 mt-auto"> */}
      <Link
        className="flex items-center gap-1 text-current"
        to="https://heroui.com?utm_source=next-app-template"
        title="heroui.com homepage"
      >
        <span className="text-default-600">
          <JhuniIcon />
        </span>
        <p className="text-primary">&copy; Piyush Bhul. All rights reserved.</p>
      </Link>
    </footer>
  );
};

export default Footer;