const updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, isDeleted } = req.body;
        const userId = req.user._id;

        const message = await Message.findById(id);

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Check if user is the sender
        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Not authorized to update this message" });
        }

        // If message is being marked as deleted
        if (isDeleted) {
            await Message.findByIdAndDelete(id);
            return res.status(200).json({ message: "Message deleted successfully" });
        }

        // Update message content
        if (content) {
            message.content = content;
            message.isEdited = true;
            await message.save();
        }

        res.status(200).json(message);
    } catch (error) {
        console.log("Error in updateMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    updateMessage
}; 