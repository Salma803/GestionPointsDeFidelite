
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers
const clientRoutes = require("./routes/Client");
const adminRoutes = require("./routes/Admin");
const produitRoutes = require("./routes/Produits");
const panierRoutes = require("./routes/PanierEnLigne");
const rayonRoutes = require("./routes/Rayon");
const promotionRoutes = require("./routes/Promotion");


app.use("/client", clientRoutes);
app.use("/admin", adminRoutes );
app.use("/produit",produitRoutes);
app.use("/panierenligne",panierRoutes);
app.use("/rayon",rayonRoutes);
app.use("/promotion",promotionRoutes);


db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
});