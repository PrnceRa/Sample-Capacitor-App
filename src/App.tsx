import { useState } from "react";
import Header from "./components/Header";
import SearchInput from "./components/SearchInput";
import TopicFidgets from "./components/FidgetIcons";
import BottomBarItems from "./components/BottomBarItems";
import "./App.css";
import FidgetCards from "./components/FidgetCards";
import FeedCardList from "./components/FeedCardList";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <GoogleOAuthProvider clientId={"978803296565-hfve05js5fl1cpjanv2o094eiua6156n.apps.googleusercontent.com"}>
    <div
      className={`flex flex-col w-screen min-h-screen ${
        isSearchFocused ? "pt-5" : ""
      } bg-white`}
    >
      {!isSearchFocused && <Header />}
      <main className="flex-1 flex flex-col items-center px-4 pt-6 pb-20">
        <div
          className={`w-full mx-auto mb-6 ${
            isSearchFocused ? "flex justify-center" : "mt-8"
          }`}
        >
          {!isSearchFocused && (
            <img
              src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
              alt="Google Logo"
              className="h-16 mx-auto mb-6"
            />
          )}
          <div className={isSearchFocused ? "w-full max-w-md" : ""}>
            <SearchInput
              onFocusChange={setIsSearchFocused}
            />
          </div>
        </div>
        {!isSearchFocused && (
          <div className="w-full max-w-md mx-auto">
            <TopicFidgets />
            <FidgetCards />
            <FeedCardList />
          </div>
        )}
      </main>
      {!isSearchFocused && <BottomBarItems />}
    </div>
    </GoogleOAuthProvider>
  );
}

export default App;
