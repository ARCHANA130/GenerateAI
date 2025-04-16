import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import mongoose from "mongoose";

export const POST = async (request) => {
  const { promptId, userId } = await request.json();

  try {
    await connectToDB();

    // Find the prompt and populate the likes
    const prompt = await Prompt.findById(promptId);
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt not found" }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize likes array if it doesn't exist
    if (!prompt.likes) {
      prompt.likes = [];
    }

    // Check if user has already liked the prompt
    const hasLiked = prompt.likes.includes(userId);

    if (hasLiked) {
      // Unlike: remove user from likes array
      prompt.likes = prompt.likes.filter(id => id.toString() !== userId);
    } else {
      // Like: add user to likes array
      prompt.likes.push(new mongoose.Types.ObjectId(userId));
    }

    // Save the updated prompt
    const updatedPrompt = await prompt.save();

    // Return the updated likes array and like status
    return new Response(JSON.stringify({
      likes: updatedPrompt.likes.map(id => id.toString()),
      hasLiked: !hasLiked,
      likeCount: updatedPrompt.likes.length
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Like error:', error);
    return new Response(JSON.stringify({ error: "Failed to update like status" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 