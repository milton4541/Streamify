import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import SignUp from "./pages/SignUp.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";


export default function App() {

  return (
    <div className="h-screen" data-theme="night">
      <Routes>
        <Route path="/" element={<HomePage/> }/>
        <Route path="/signup" element={<SignUp/> }/>
        <Route path="/login" element={<LoginPage/> }/>
        <Route path="/notifications" element={<NotificationPage/> }/>
        <Route path="/call" element={<CallPage/> }/>
        <Route path="/chat" element={<ChatPage/> }/>
        <Route path="/onboarding" element={<OnboardingPage/> }/>

      </Routes>
    </div>
  )
}

