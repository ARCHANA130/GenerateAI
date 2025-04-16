import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
    const { userId, prompt, tag , image} = await request.json();

    try {
        await connectToDB();
        const newPrompt = new Prompt({ 
            creator: userId, 
            prompt, 
            tag,
            image,
            likes: [] // Initialize empty likes array
        });

        await newPrompt.save();
        return new Response(JSON.stringify(newPrompt), { 
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error creating prompt:', error);
        return new Response(JSON.stringify({ 
            error: "Failed to create a new prompt",
            details: error.message 
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
