import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import Actions from "../components/Actions";
import { BsThreeDots } from "react-icons/bs";
import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useNavigate, useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from 'date-fns';
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";


const PostPage = () => {
	const { user, loading } = useGetUserProfile();
	const { pid } = useParams();
	//   const [post,setPost] = useState(null);
	const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);
	const navigate = useNavigate();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const currentPost = posts[0];
	useEffect(() => {
		const getPost = async () => {
			// setPost([]);
			try {
				const res = await fetch(`/api/posts/${pid}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setPosts([data]);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};
		getPost();
	}, [showToast, pid, setPosts]);

	const handleDeletePost = async () => {
		try {
			if (!window.confirm("Are you sure you want to delete this post?")) return;

			const res = await fetch(`/api/posts/${currentPost._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");
			navigate(`/${currentUser.username}`);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!currentPost) return null;

	return (
		<>
			<Box position={"absolute"}
				left={"50%"}
				w={{ base: "100%", md: "80%", lg: "620px" }}
				p={4}
				transform={"translateX(-50%)"}>
				<Flex>
					<Flex w={"full"} alignItems={"center"} gap={3}>
						<Avatar src={user.profilePic} size={"md"} name={user.name} />
						<Text fontSize={"sm"} fontWeight={"bold"}>
							{user.username}
						</Text>
					</Flex>
					<Flex gap={4} alignItems={"center"}>
						<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
							{formatDistanceToNow(new Date(currentPost.createdAt))} ago
						</Text>

						{currentUser?._id === user._id && (
							<DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />
						)}
					</Flex>
				</Flex>

				<Text my={3}>{currentPost.text}</Text>

				{currentPost.img && (
					<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
						<Image src={currentPost.img} w={"full"} />
					</Box>
				)}

				<Flex gap={3} my={1}>
					<Actions post={currentPost} />
				</Flex>
				<Divider my="4" />
				{currentPost.replies.slice().reverse().map((reply) => (
					<Comment
						key={reply._id}
						reply={reply}
						lastReply={reply._id === currentPost.replies[0]._id}
					/>
				))}
			</Box>
		</>
	)
}

export default PostPage