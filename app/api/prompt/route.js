import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (request) => {
    try {
        await connectToDB();

        const prompts = await Prompt.find({})
            .populate('creator');
           

        return new Response(JSON.stringify(prompts), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching prompts:', error);
        return new Response(JSON.stringify({ 
            error: "Failed to fetch prompts",
            details: error.message 
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}; 