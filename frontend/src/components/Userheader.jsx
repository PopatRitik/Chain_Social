import { Flex, Text, Avatar, Box, VStack, Link, Menu, MenuList, MenuButton, Portal, MenuItem, useToast, useColorModeValue, Button } from "@chakra-ui/react";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const Userheader = ({ user }) => {
     const toast = useToast();
     const currentUser = useRecoilValue(userAtom);//logged in user
     const textColor = useColorModeValue("gray.800", "gray.200"); // Adjust text color based on color mode
     const bgTextColor = useColorModeValue("white", "gray.800"); // Adjust text background color based on color mode
     const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

     const copyURL = () => {
          const currentURL = window.location.href;
          navigator.clipboard.writeText(currentURL).then(() => {
               toast({
                    title: "Success.",
                    status: "success",
                    description: "Profile link copied.",
                    duration: 3000,
                    isClosable: true,
               });
          });
     };

     return (
          <>
               <VStack gap={4} alignItems={"start"}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                         <Box>
                              <Text fontSize={"2x1"} fontWeight={"bold"}>
                                   {user.name}
                              </Text>
                              <Flex gap={2} alignItems={"center"}>
                                   <Text fontSize={"small"}>{user.username}</Text>
                              </Flex>
                         </Box>
                         <Box>
                              {user.profilePic && (
                                   <Avatar
                                        name={user.name}
                                        src={user.profilePic}
                                        size={{
                                             base: "md",
                                             md: "xl",
                                        }}
                                   />
                              )}
                              {!user.profilePic && (
                                   <Avatar
                                        name={user.name}
                                        src='https://bit.ly/broken-link'
                                        size={{
                                             base: "md",
                                             md: "xl",
                                        }}
                                   />
                              )}
                         </Box>
                    </Flex>
                    <Text>{user.bio}</Text>
                    {currentUser?._id === user._id && (
                         <Link as={RouterLink} to='/update'>
                              <Button size={"sm"}>Update Profile</Button>
                         </Link>
                    )}
                    {currentUser?._id !== user._id && (
                         <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
                              {following ? "Unfollow" : "Follow"}
                         </Button>
                    )}
                    <Flex w={"full"} justifyContent={"space-between"}>
                         <Flex gap={2} alignItems={"center"}>
                              <Text color={"gray.light"}>{user.followers.length} followers</Text>
                         </Flex>
                         <Flex>
                              <Box className="icon-container">
                                   <Menu>
                                        <MenuButton>
                                             <CgMoreO size={24} cursor={"pointer"} />
                                        </MenuButton>
                                        <Portal>
                                             <MenuList bg={"gray.dark"}>
                                                  <MenuItem bg={"gray.dark"} onClick={copyURL}>Copy Link</MenuItem>
                                             </MenuList>
                                        </Portal>
                                   </Menu>
                              </Box>
                         </Flex>
                    </Flex>
                    <Flex w={"full"}>
                         <Flex flex={1} borderBottom={"1.5px solid"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                              <Text fontWeight={"bold"}>Chain</Text>
                         </Flex>
                    </Flex>
               </VStack>
          </>
     );
};

export default Userheader;
