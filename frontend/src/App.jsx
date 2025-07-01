import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import SignUp from "./pages/SignUp.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnBoardingPage from "./pages/OnBoardingPage.jsx";
import PageLoader from "./components/PageLoader.js";
import useAuthUser from "./hooks/useAuthUser.js";

export default function App() {

const {isLoading,authUser}= useAuthUser()

const isAuthenticated = Boolean(authUser)
const isOnboarded = authUser?.isOnboarded
  if(isLoading) return <PageLoader/>


  return (
    <div className="h-screen" data-theme="night">
      <Routes>
        <Route path="/" element={isAuthenticated ? <HomePage/> : <Navigate to="/login"/> }/>
        <Route path="/signup" element={!isAuthenticated ? <SignUp/> : <Navigate to="/"/>}/>
        <Route path="/login" element={!isAuthenticated ? <LoginPage/>: <Navigate to="/"/>}/>
        <Route path="/notifications" element={isAuthenticated ?<NotificationPage/> : <Navigate to="/login"/> }/>
        <Route path="/call" element={isAuthenticated ?<CallPage/> : <Navigate to="/login"/> }/>
        <Route path="/chat" element={isAuthenticated ?<ChatPage/> : <Navigate to="/login"/> }/>
        <Route path="/onboarding" element={isAuthenticated ?<OnBoardingPage/> : <Navigate to="/login"/> }/>

      </Routes>
    </div>
  )
}

