import express from 'express';
import Thread from '../models/Thread.js';
import getOpenAIAPIResponse from "../untils/openai.js";

const router = express.Router();



// Get all threads

router.get('/threads',async (req,res) => {
    try{
        const threads = await Thread.find().sort({updatedAt: -1}); // descending order - recent data on top
        res.json(threads);
        console.log("Fetched threads:", threads);
    }
    catch(error){
        console.log("Error fetching threads:", error);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

// Get a specific thread by ID

router.get('/threads/:threadId', async (req,res) => {
    const {threadId} = req.params;

    try{
        const thread = await Thread.findOne({threadId});
        if(!thread){
            res.status(404).json({error: "Thread not found"});
        }
        else{
            res.json(thread);
        }
    }
    catch(error){
        console.log("Error fetching thread:", error);
        res.status(500).json({error: "Failed to fetch thread"});
    }
});

// thread deletion

router.delete('/threads/:threadId', async (req, res) => {
    const {threadId} = req.params;

    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});
       
        if(!deletedThread){
           res.status(404).json({error: "Thread not found"});
        }
        else{

            res.status(200).json({message: "Thread deleted successfully"});
        }
    }
    catch(error){
        console.log("Error deleting thread:", error);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

router.post('/threads', async (req,res) => {
    const {threadId, message} = req.body;

    if(!threadId || !message){
        return res.status(400).json({error: "missing the required fields"});
    }

    try{
        let thread = await Thread.findOne({threadId});

        if(!thread){
            // create new thread
            thread = new Thread({
                threadId,
                title: message, // message.slice(0, 40)
                messages: [{
                    role: 'user',
                    content: message
                }]
            });
        }
            else{
                // update existing thread
                thread.messages.push({role: 'user', content: message});

            }

            const assistantReply = await getOpenAIAPIResponse(message);
            
            thread.messages.push({role: 'assistant', content: assistantReply});
            thread.updatedAt = Date.now();
            await thread.save();
            res.json({reply: assistantReply});
    }
    catch(error){
        console.log("Error handling thread:", error);
        res.status(500).json({error: "Failed to handle thread"}); 
        }
    }
);

export default router;
