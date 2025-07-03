import React, { useState } from "react";
import { GlobalProvider } from "../Context/GlobalProvider";
import { ChatVoiceProvider } from "../Context/ChatVoiceContext";
import { SelectionProvider } from "../Context/SelectionContext";
import "../Styles/mainPageStyles.css";
import Sidebar from "../Components/Sidebar";
import Contextpanel from "../Components/ContextPanel";
import Topbar from "../Components/Topbar";
import ContentArea from "../Components/ContentArea";
import RightSidebar from "../Components/RightSideBar";

interface MainPageProps {
  section: string;
}

const MainPage: React.FC<MainPageProps> = ({ section }) => {
  const [activeSection, setActiveSection] = useState(section);

  return (
    <GlobalProvider>
      <SelectionProvider>
          <ChatVoiceProvider>
            <div className="main-page-container">
              {/* Left Sidebar */}
              <Sidebar setActiveSection={setActiveSection} />

              {/* Recent Friends & Files Section */}
              <Contextpanel />

              {/* Main Content Area */}
              <div className="main-content-wrapper">
                {/* Top Bar */}
                <Topbar />

                {/* Dynamic Content Area */}
                <ContentArea activeSection={activeSection}/>
              </div>

              {/* Right Sidebar (Only Visible on Home) */}
              {activeSection === "home" && <RightSidebar />}
            </div>
        </ChatVoiceProvider>
      </SelectionProvider>
    </GlobalProvider>
  );
};

export default MainPage;
