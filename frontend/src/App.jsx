import { Button, Container,Box } from "@chakra-ui/react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import Header from "./components/Header"
import Postpage from "./pages/Postpage"
import Userpage from "./pages/Userpage"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import UpdatePage from "./pages/UpdatePage"
import Logout from "./components/Logout"
import { useRecoilValue } from "recoil"
import userAtom from "./atoms/userAtom"
import CreatePost from "./components/CreatePost"
import ChatPage from "./pages/ChatPage"
import { SettingsPage } from "./pages/SettingsPage"

function App() {
  const user=useRecoilValue(userAtom);
  const {pathname}=useLocation();
  console.log(user);
  return (
    <>
    <Box position={"relative"} w={"full"}>
    <Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
        <Header />
        <Routes>
        <Route path='/' element={user ? <HomePage /> : <Navigate to='/auth' />} />
				<Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/' />} />
				<Route path='/update' element={user ? <UpdatePage /> : <Navigate to='/auth' />} />
        <Route
						path='/:username'
						element={
							user ? (
								<>
									<Userpage />
									<CreatePost />
								</>
							) : (
								<Userpage />
							)
						}
					/>
        <Route path='/:username/post/:pid' element={<Postpage />} />
					<Route path='/chat' element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
          <Route path='/settings' element={user ? <SettingsPage />: <Navigate to={"/auth"} />} />
        </Routes>
      </Container>
      </Box>
    </>
  )
}

export default App
