import { Flex, useColorMode, Image, Link, Button, Input, useToast } from "@chakra-ui/react"; // Importing useColorMode
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode(); // Using useColorMode hook
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const [searchingUser, setSearchingUser] = useState(false);
	const [searchText, setSearchText] = useState("");
	const toast = useToast();
	const navigate = useNavigate();

	const handleSearch = async (e) => {
		e.preventDefault();
		setSearchingUser(true);
		try {
			const res = await fetch(`/api/users/getUser/${searchText}`);
			const searchedUser = await res.json();
			if (searchedUser.error) {
				toast({
					title: "Error",
					description: searchedUser.error,
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				return;
			}
			navigate(`/${searchedUser.username}`);
		} catch (error) {
			toast({
				title: "Error",
				description: error.message,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setSearchingUser(false);
		}
	};

	return (
		<Flex justifyContent={"space-between"} mt={6} mb="12">
			{user && (
				<Flex alignItems={"center"} gap={4}>
					<Link as={RouterLink} to='/'>
						<AiFillHome size={24} />
					</Link>
					<Link as={RouterLink} to={`/${user.username}`}>
						<RxAvatar size={24} />
					</Link>
					<Link as={RouterLink} to={`/chat`}>
						<BsFillChatQuoteFill size={20} />
					</Link>
					<Link as={RouterLink} to={`/settings`}>
						<MdOutlineSettings size={20} />
					</Link>
				</Flex>
			)}
			{!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
					Login
				</Link>
			)}
			<Image
				cursor={"pointer"}
				alt='logo'
				w={7}
				h={7}
				src={colorMode === "dark" ? "/light.png" : "/dark.png"}
				onClick={toggleColorMode}
			/>
			{user && (
				<Flex alignItems={"center"} gap={4}>
					<form onSubmit={handleSearch}>
						<Flex alignItems={"center"} gap={2}>
							<Input placeholder='Search for a username' onChange={(e) => setSearchText(e.target.value)} />
							<Button size={"sm"} type="submit" isLoading={searchingUser}>
								<SearchIcon />
							</Button>
						</Flex>
					</form>
					<Button size={"xs"} onClick={logout}><FiLogOut size={20} /></Button>
				</Flex>
			)}
			{!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
					Sign up
				</Link>
			)}
		</Flex>
	);
}

export default Header;
