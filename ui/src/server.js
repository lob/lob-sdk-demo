const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 8080;

const router = express.Router();
router.get("/", (req, res) => {
    console.log('request received');
    try {
        res.render("./home");
    } catch (e) {
        console.error(e);
        res.status(res.statusCode);
        res.render("./shared/error", {
            error: e
        });
    }
});
app.use("/", router);
app.use(cors({
    origin: '*'
}));
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
