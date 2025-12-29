🟢 Step-1 — server.js এ Post CRUD routes যোগ করা

আপনি আগের Day-3 এর server.js ব্যবহার করবেন
(Express + Prisma already setup)

✍️ Create Post — POST /posts
app.post("/posts", async (req, res) => {
const { title, content, userId } = req.body;

try {
const post = await prisma.post.create({
data: { title, content, userId: Number(userId) }
});
res.json(post);
} catch (e) {
res.status(400).json({ error: "User does not exist!" });
}
});

📚 Get All Posts — GET /posts
app.get("/posts", async (req, res) => {
const posts = await prisma.post.findMany({
include: { user: true } // related user info
});
res.json(posts);
});

🔍 Get Single Post — GET /posts/:id
app.get("/posts/:id", async (req, res) => {
const id = Number(req.params.id);

const post = await prisma.post.findUnique({
where: { id },
include: { user: true }
});

post ? res.json(post) : res.status(404).json({ error: "Post not found" });
});

✏️ Update Post — PUT /posts/:id
app.put("/posts/:id", async (req, res) => {
const id = Number(req.params.id);
const { title, content, published } = req.body;

try {
const post = await prisma.post.update({
where: { id },
data: { title, content, published }
});
res.json(post);
} catch {
res.status(404).json({ error: "Cannot update post" });
}
});

🗑️ Delete Post — DELETE /posts/:id
app.delete("/posts/:id", async (req, res) => {
const id = Number(req.params.id);

try {
const deleted = await prisma.post.delete({ where: { id }});
res.json({ message: "Post deleted", deleted });
} catch {
res.status(404).json({ error: "Post not found" });
}
});

🔗 Step-2 — User wise posts fetch

/users/:id/posts

app.get("/users/:id/posts", async (req, res) => {
const id = Number(req.params.id);

const user = await prisma.user.findUnique({
where: { id },
include: { posts: true }
});

user ? res.json(user.posts) : res.status(404).json({ error: "User not found" });
});

🔍 Step-3 — Search Post

/posts?search=keyword

app.get("/search/posts", async (req, res) => {
const { search } = req.query;

const posts = await prisma.post.findMany({
where: {
title: {
contains: search,
mode: "insensitive"
}
}
});

res.json(posts);
});

| Method | URL                          | Body                                                  |
| ------ | ---------------------------- | ----------------------------------------------------- |
| POST   | `/posts`                     | `{ "title": "New", "content": "Hello", "userId": 1 }` |
| GET    | `/posts`                     | —                                                     |
| GET    | `/posts/1`                   | —                                                     |
| PUT    | `/posts/1`                   | `{ "title": "Updated" }`                              |
| DELETE | `/posts/1`                   | —                                                     |
| GET    | `/users/1/posts`             | —                                                     |
| GET    | `/search/posts?search=hello` | —                                                     |
