import Message from "../models/message.model.js";
import * as cloudinary from 'cloudinary';


export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {

    console.log("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages =async(req, res)=>{
    try {
        const {id:userToChatId} = req.params
        const senderId = req.user._id

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId },
              ],
        
        })
        res.status(200).json(messages)
    } catch (error) {
        
        console.log("Error in getMessages: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const sendMessage = async(req, res)=>{
    try {
        const {text, image} = req.body
        const {id:receiverId} = req.params
        const senderId = req.user._id

        let imageURL;

        if(image){
            const uploadedResponse = await cloudinary.uploader.upload(image)
            imageURL = uploadedResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageURL
        });

        //Todo: realtime functionality Socket
        res.status(201).json(newMessage)   

    } catch (error) {

        console.log("Error in sendMessage: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}