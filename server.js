const path = require("path");
const jsonServer = require("json-server");
const cors = require("cors");

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const dbFile = path.join(__dirname, "db.json");
const router = jsonServer.router(dbFile);
const port = process.env.PORT || 3001;

// this allows the frontend to access the backend
server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Required fields for validation
const requiredFields = [
  "name",
  "title",
  "salary",
  "phone",
  "email",
  "animal",
  "startDate",
  "location",
  "department",
  "skills",
];

// this helps to validate the incoming employee data
server.use((req, res, next) => {
  console.log("got here");
  const isEmployeeRoute = req.url.startsWith("/employees");
  const isModifyingMethod = ["POST", "PUT", "PATCH"].includes(req.method);

  if (isEmployeeRoute && isModifyingMethod) {
    const body = req.body;
    const errors = [];

    // Only enforce required fields on POST (creating new employee)
    if (req.method === "POST") {
      if (typeof body.name !== "string" || !body.name.trim())
        errors.push("name");
      if (typeof body.title !== "string" || !body.title.trim())
        errors.push("title");
      if (typeof body.phone !== "string" || !body.phone.trim())
        errors.push("phone");
      if (typeof body.email !== "string" || !body.email.trim())
        errors.push("email");
      if (typeof body.animal !== "string" || !body.animal.trim())
        errors.push("animal");
      if (typeof body.startDate !== "string" || !body.startDate.trim())
        errors.push("startDate");
      if (typeof body.location !== "string" || !body.location.trim())
        errors.push("location");
      if (typeof body.department !== "string" || !body.department.trim())
        errors.push("department");
      if (typeof body.salary !== "number") errors.push("salary");
      if (!Array.isArray(body.skills)) errors.push("skills");
    }

    // For PUT/PATCH, only validate fields that are present in the request
    if (req.method === "PUT" || req.method === "PATCH") {
      if (
        "name" in body &&
        (typeof body.name !== "string" || !body.name.trim())
      )
        errors.push("name");
      if (
        "title" in body &&
        (typeof body.title !== "string" || !body.title.trim())
      )
        errors.push("title");
      if (
        "phone" in body &&
        (typeof body.phone !== "string" || !body.phone.trim())
      )
        errors.push("phone");
      if (
        "email" in body &&
        (typeof body.email !== "string" || !body.email.trim())
      )
        errors.push("email");
      if (
        "animal" in body &&
        (typeof body.animal !== "string" || !body.animal.trim())
      )
        errors.push("animal");
      if (
        "startDate" in body &&
        (typeof body.startDate !== "string" || !body.startDate.trim())
      )
        errors.push("startDate");
      if (
        "location" in body &&
        (typeof body.location !== "string" || !body.location.trim())
      )
        errors.push("location");
      if (
        "department" in body &&
        (typeof body.department !== "string" || !body.department.trim())
      )
        errors.push("department");
      if ("salary" in body && typeof body.salary !== "number")
        errors.push("salary");
      if ("skills" in body && !Array.isArray(body.skills))
        errors.push("skills");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: `Invalid or missing fields: ${errors.join(", ")}`,
      });
    }
  }

  next();
});

// this loads initial data
console.log("📂 Loading DB from:", dbFile);
console.log("📊 Initial state:", JSON.stringify(router.db.getState(), null, 2));

server.use(router);

server.listen(port, () => {
  console.log(`🚀 JSON Server listening at http://localhost:${port}`);
});
