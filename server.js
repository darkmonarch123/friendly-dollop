//What's New 
// we are using prisma to interact with the database instead of in-memory data store. The routes are now asynchronous and handle errors properly. The server will return appropriate status codes and messages for different scenarios.
// Using a database allows for persistent storage of tasks, which means that the data will not be lost when the server restarts. This is a significant improvement over the in-memory data store, which loses all data when the server is restarted.
// The use of Prisma also allows for more complex queries and relationships between data, which can be beneficial as the application grows in complexity.
// Using Neon db a postrge serverless database to store the tasks. The connection string is stored in an environment variable for security reasons. Prisma will use this connection string to connect to the database and perform CRUD operations on the tasks.
// we using a try and catch block for error handling in each route. This allows us to catch any errors that may occur during database operations and return a 500 Internal Server Error response to the client. This is important for maintaining the stability and reliability of the server, as it prevents unhandled exceptions from crashing the server.
// What i learnt from day 2 /wk 1
// i the api we that are provided to us allows use interact data and the web service , which is so important and cannot be used without about it 
// for and learnt how to debug without ai or llm avaible to us , and how to write reusable code and been able to interprete wuat a line of code does 
// i leanrt schema for databases 


const express = require('express');
const prisma = require('./db');
const app = express();
const port = 3030;


// 1. Middleware (Must come before routes)
app.use(express.json());

// In-memory data store
let tasks = [
    { id: 1, title: "Learn Https", completed: false },
    { id: 2, title: "Learn Express", completed: true }
];

// 2. Routes

// Get all tasks
app.get('/api/tasks', async (req, res) => {
   try{
    const tasks = await prisma.task.findMany();
    return res.status(200).json(tasks)
   }catch(error){
    return res.status(500).json({message:"Internal server error"})
   }
});

// Get a specific task by ID
// Primsa Equivalent: prisma.task.findUnique({ where: { id: taskId } })
app.get('/api/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);
    try{
        const task = await prisma.task.findUnique({
            where: { id: taskId }
        });
        if(!task){
            return res.status(404).json({message:"Task not Found"})
        }
        return res.status(200).json(task)
    }catch(error){
        return res.status(500).json({message:"Internal server error"})
    }
});

// Create a new task 
//Using prisma to create a new task in the database
app.post('/api/tasks',async (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Title is required" });
    }
    try{
        const newTask  = await prisma.task.create({
            data:{title: title.trim()}
        })
          return res.status(201).json(newTask)
    }catch(error){
        return res.status(500).json({message:"Internal server error"})
    }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);
    try{
        const existingTask = await prisma.task.findUnique({where:{id: taskId} });

        if(!existingTask){
            return res.status(404).json({message:"Task not found"});
        }
        await prisma.task.delete({where:{id:taskId}});

        return res.status(200).json({message:"Task deleted successfully"})
    }catch(error){
        return res.status(500).json({message:"Failed to delete task"})
    }
});

//Update a task
app.put('/api/tasks/:id', async (req,res)=>{
    const taksId = parseInt(req.params.id);
    const {title, completed} = req.body;

    try{
        const existingTask = await prisma.task.findUnique({where:{id: taksId} });

        if(!existingTask){
            return res.status(404).json({message:"Task not found"});
        }

        const UpdateData={}

        if(title !== undefined && title.trim === ""){
            return res.status(400).json({message:"Title cannot be empty"})
        }  
        if(completed !== undefined){
            UpdateData.completed = Boolean(completed);
        }

        const UpdateTask = await prisma.task.update({where:{id:taksId}, data:UpdateData});
        return res.status(200).json(UpdateTask);
    }catch(error){
        return res.status(500).json({message:"Failed to update task"})
    }
})

// 3. Start Server (Must come at the very end)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});