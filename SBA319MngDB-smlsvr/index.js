const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies

const PORT = process.env.PORT || 7000;

// Define schemas
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
}, { timestamps: true });

const postSchema = mongoose.Schema({
    title: String,
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Define models
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

// APIs below
// Read
app.get("/", async (req, res) => {
    const data = await User.find({});
    res.json({ success: true, data: data });
});

// Create data / save to MongoDB
app.post("/create", async (req, res) => {
    console.log(req.body);
    const data = new User(req.body);
    await data.save();
    res.send({ success: true, message: "Data saved successfully", data: data });
});

// Update data
app.put("/update", async (req, res) => {
    console.log(req.body);
    const { _id, ...rest } = req.body;
    console.log(rest);
    const data = await User.updateOne({ _id: _id }, rest);
    res.send({ success: true, message: "Data updated successfully", data: data });
});

// Delete data
app.delete("/delete/:id", async(req,res)=>{
    const id = req.params.id;
    console.log(id);
    const data = await User.deleteOne({ _id: id });
    res.send({ success: true, message: "Data deleted successfully", data: data });
});

// MongoDB connection
mongoose.connect("mongodb+srv://Perscholas-class:ajnwNDUxTfZxUZVt@mongopractice.qgjr6yr.mongodb.net/crudoperation")
    .then(() => {
        console.log("Connected to MongoDB");
        
        // Populate collections with sample data
        const usersData = [
            { name: 'Jimmy Horse', email: 'horse222@example.com', mobile: '1234567890' },
            { name: 'Jane Doe', email: 'jane@example.com', mobile: '0987654321' },
            // Add more sample data as needed
        ];

        const populateUsers = async () => {
            try {
                for (const userData of usersData) {
                    const existingUser = await User.findOne({ email: userData.email });
                    if (!existingUser) {
                        await User.create(userData);
                        console.log(`User ${userData.email} inserted successfully`);
                    } else {
                        console.log(`User ${userData.email} already exists, skipping...`);
                    }
                }
            } catch (error) {
                console.error('Error inserting sample data:', error);
            }
        };
        // Call the function to populate users data
        populateUsers();

        // Start the server
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });
