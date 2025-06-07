import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

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

    //after saving the message in the db we directly send it to the user
    const receiverSocketId = getRecieverSocketId(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json(newMessage);

  } catch (error) {
    console.log("Error in messageController", error.message);
    res.status(500).json({
      message: "Internal Server error"
    })
  }
}





export const updateMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { deleteForSender, deleteForReciever } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if user is sender or receiver
    if (message.senderId.toString() === userId.toString()) {
      message.deleteForSender = deleteForSender;
    } else if (message.receiverId.toString() === userId.toString()) {
      message.deleteForReciever = deleteForReciever;
    } else {
      return res.status(403).json({ message: "Not authorized to update this message" });
    }

    // If both sender and receiver have deleted, remove the message completely
    if (message.deleteForSender && message.deleteForReciever) {
      await Message.findByIdAndDelete(messageId);
      const receiverSocketId = getRecieverSocketId(message.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", { _id: messageId, message: "Message deleted successfully" });
      }
      return res.status(200).json({ message: "Message deleted successfully" });
    }

    await message.save();

    // Emit socket event for message update
    const receiverSocketId = getRecieverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(200).json(message);

  } catch (error) {
    console.log("Error in updateMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};





export const partialDelete = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { deleteForSender, deleteForReciever } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if user is sender or receiver
    if (message.senderId.toString() === userId.toString()) {
      message.deleteForSender = deleteForSender;
    } else if (message.receiverId.toString() === userId.toString()) {
      message.deleteForReciever = deleteForReciever;
    } else {
      return res.status(403).json({ message: "Not authorized to update this message" });
    }

    // If both sender and receiver have deleted, remove the message completely
    if (message.deleteForSender && message.deleteForReciever) {
      await Message.findByIdAndDelete(messageId);
      const receiverSocketId = getRecieverSocketId(message.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", { _id: messageId, message: "Message deleted successfully" });
      }
      return res.status(200).json({ message: "Message deleted successfully" });
    }

    await message.save();

    // Emit socket event for message update
    const receiverSocketId = getRecieverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(200).json(message);

  } catch (error) {
    console.log("Error in message controller", error);
  }
}

export const fullDelete = async (req, res) => {
  try {
    const { messId } = req.params;
    const message = await Message.findById(messId);

    if (!message) {
      res.status(404).json({ message: "No such message was found" })
    }

    const response = await Message.findByIdAndDelete(messId);

  } catch (error) {
    console.log("Error in message controller", error);
  }
}

