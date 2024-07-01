import { useEffect, useState } from "react"
import Userheader from "../components/Userheader"
import Post from "../components/Post"
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Box } from "@chakra-ui/react";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtoms from "../atoms/postsAtom";

const Userpage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtoms);
  const username = useParams();
  console.log(username)
  const showToast = useShowToast();
  const [fetchingPosts, setFetchingPosts] = useState(true);
  useEffect(() => {
    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username.username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    }
    getPosts();
  }, [username, showToast, setPosts]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <>
      <Box position={"absolute"}
        left={"50%"}
        w={{ base: "100%", md: "80%", lg: "620px" }}
        p={4}
        transform={"translateX(-50%)"}>
        <Userheader user={user} />
        {!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
        {fetchingPosts && (
          <Flex justifyContent={"center"} my={12}>
            <Spinner size={"xl"} />
          </Flex>
        )}

        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>

    </>
  )
}

export default Userpage