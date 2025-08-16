const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/questions", require("./routes/questions"));
app.use("/api/answers", require("./routes/answers"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/votes", require("./routes/votes"));
app.use("/api/notifications", require("./routes/notifications"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
