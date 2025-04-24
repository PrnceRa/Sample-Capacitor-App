import type React from "react";
import { useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface DecodedUser {
  picture: string;
  name: string;
  email: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<DecodedUser | null>(null);

  return (
    <header className="flex justify-end items-center p-4">
      {user ? (
        <div className="flex items-center space-x-4">
          <img
            src={user.picture}
            alt={user.name}
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => {
              googleLogout();
              setUser(null);
            }}
          />
        </div>
      ) : (
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              const decoded: DecodedUser = jwtDecode(credentialResponse.credential);
              setUser(decoded);
            }
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      )}
    </header>
  );
};

export default Header;
