import React from "react";
import { SignIn } from "../signin";

const Header = () => {
  return (
    <header className="font-extrabold text-2xl tracking-wide text-center  my-3 border py-2">
      Grocery Helper
      <div className="text-right"><SignIn/></div>
    </header>
  );
};

export default Header;
