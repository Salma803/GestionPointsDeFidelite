
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
const panierRoutes = require("./routes/Panier");
const rayonRoutes = require("./routes/Rayon");


app.use("/client", clientRoutes);
app.use("/admin", adminRoutes );
app.use("/produit",produitRoutes);
app.use("/panier",panierRoutes);
app.use("/rayon",rayonRoutes);


db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
});