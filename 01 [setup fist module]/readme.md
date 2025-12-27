## Step 1 — Project Folder

```
npm init -y
```

এতে package.json তৈরি হবে।

# Step 2 — Prisma install করুন

```
npm install prisma @prisma/client
```

# Step 3 — Prisma Initialize (Config ফাইল তৈরি)

```
npx prisma init
```

এখন আপনার project-এ তৈরি হবে 👇

```
prisma/
└─ schema.prisma
.env
```

# Step 4 — Database হিসেবে postgresql ব্যবহার

.env ফাইল ওপেন করে এটা দিন:

```
DATABASE_URL="postgresql://postgres:admin@localhost:5432/prisma2"

```

# Step 5 — প্রথম Prisma Model লিখুন

prisma/schema.prisma ফাইল ওপেন করুন এবং নিচের মতো রাখুন 👇

```
datasource db {
provider = "sqlite"
url = env("DATABASE_URL")
}
```

```
generator client {
provider = "prisma-client-js"
}

```

```
model User {
id Int @id @default(autoincrement())
name String
email String @unique
createdAt DateTime @default(now())
}

```

এখানে আমরা User টেবিল বানালাম।

# Step 6 — Migration রান (টেবিল তৈরী)

```
npx prisma migrate dev --name init
```

এবার dev.db database তৈরি হয়ে গেল!

# Step 7 — Database GUI দিয়ে দেখা

```
npx prisma studio
```

open in browser
