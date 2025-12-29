আজ আমরা User CRUD API বানাবো। Browser / Postman / Thunder Client দিয়ে টেস্ট করতে পারবেন।
Day-3 শেষ হলে আপনি Prisma-backed API বানাতে পারবেন — Next.js / React / Flutter যেখানেই চাই ব্যবহার করতে পারবেন।

📆 Prisma Day-3 (Express API + Prisma Client)
🎯 আজকের লক্ষ্য

Express install

Prisma Client connect

REST API build

GET / POST / PUT / DELETE routes

Error handling + validation basics

Assignment project

🟢 Step 1 — Express install করুন

টার্মিনালে রান করুন:

npm install express

নিশ্চিত করুন package.json এ আছে:

"type": "module"

🟠 Step 2 — server.js ফাইল তৈরি করুন
touch server.js

🔵 Step 3 — API Server + Prisma সংযোগ

server.js 👇

import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Home route
app.get("/", (req, res) => {
res.send("🎉 Prisma + Express API Working!");
});

⚡ Step 4 — API Routes (CRUD)
🟢 Create User (POST)
app.post("/users", async (req, res) => {
const { name, email } = req.body;

try {
const user = await prisma.user.create({
data: { name, email },
});
res.json(user);
} catch (error) {
res.status(400).json({ error: "Error creating user" });
}
});

🔵 Read All Users (GET)
app.get("/users", async (req, res) => {
const users = await prisma.user.findMany();
res.json(users);
});

🟡 Read Single User (GET /:id)
app.get("/users/:id", async (req, res) => {
const id = Number(req.params.id);

const user = await prisma.user.findUnique({
where: { id },
});

user ? res.json(user) : res.status(404).json({ error: "User not found" });
});

🟠 Update User (PUT /:id)
app.put("/users/:id", async (req, res) => {
const id = Number(req.params.id);
const { name } = req.body;

try {
const user = await prisma.user.update({
where: { id },
data: { name },
});
res.json(user);
} catch {
res.status(404).json({ error: "Cannot update user" });
}
});

🔴 Delete User (DELETE /:id)
app.delete("/users/:id", async (req, res) => {
const id = Number(req.params.id);

try {
const user = await prisma.user.delete({
where: { id },
});
res.json({ message: "User deleted", user });
} catch {
res.status(404).json({ error: "User not found" });
}
});

🏁 Step 5 — Server Run করুন
node server.js

আপনার API এখন চলছে:

http://localhost:5000

🚦 Test URLs
Method Route Example Payload
GET /users —
GET /users/1 —
POST /users { "name": "Shobur", "email": "test@mail.com" }
PUT /users/1 { "name": "Updated Name" }
DELETE /users/1 —
🎯 Day-3 Practice Tasks
Task Difficulty

1. email duplicate error friendly message 🟡
2. pagination যোগ করুন (skip/take) 🟡
3. search by name API → /users?search=abc 🔴
4. soft delete system তৈরি করুন 🔴🔥
5. isActive Boolean যোগ করে filter করুন 🔵
   🤯 Bonus Idea (Optional)

User → Post relation অ্যাড করুন
আগামী Day-4 এ relation project শুরু হবে।
