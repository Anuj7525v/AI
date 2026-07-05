import express from 'express';
import cors from 'cors';
import env from 'dotenv';
import mongoose from 'mongoose';
import chatRoutes from "./routes/chat.js";

env.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});



app.use("/api",chatRoutes);


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Database Connection Error");
        console.error(error);
        process.exit(1);
    }
}

connectDB();