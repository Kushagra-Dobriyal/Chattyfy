import User from "../models/user.model.js";
import Message from "../models/message.model.js";



export const getUsersForSidebar = async (req, res) => {

  try {
    // our user id
    const loggedInUserId = req.user._id;

    //ne->not include
    //here we are using the {$ne:loggedInUserId} to fetch the user_if of all the users fdorm tthe databse directly....
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log("Error in getUsersForSidebar", error.message);
  }
};

export const getMessages = async (req, res) => {
  try {
    //here we are renaming the id->userToChatId
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },//messages that i have send to the user
        { senderId: userToChatId, receiverId: myId },//messages that the other user has send me
      ],
    });  // mongo query to fetch the message send so far...

    // ===> $or - This is a MongoDB operator that means "match if ANY of these conditions are true"

  

    res.status(200).json(messages);

  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    // OR
    // const text=req.body.text;
    // const image=req.body.image;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, 
      // {

      //       folder:'chat-images',
      //       type:'image'
      //      }  we can do this for better storage structure in cloudinary
      // }
      );
      imageUrl = uploadResponse.secure_url;  //coludinary optimised url
    }

    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverId,
      image: imageUrl,
      text: text
    })

    await newMessage.save();


    // todo :realtime functionality goes here (Socket.io)
    res.status(201).json(newMessage);



  } catch (error) {
    console.log("Error in messageController", error.message);
    res.status(500).json({
      message: "Internal Server error"
    })
  }
}