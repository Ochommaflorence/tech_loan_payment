import express from "express";
// import loan_repayment from "./loan_repayment/endpoint";
// import user_contribution from "./user_contribution/endpoint";
// import loan from "./loan/endpoint";
import user from "./User/endpoints";
import otherRoutes from "./helpers/notFound";


const app = express();

// app.use("/api/v1/loan_repayment", loan_repayment);
// app.use("/api/v1/loan",loan);
app.use("/api/v1/user", user)
// app.use("/api/v1/usercontribution", user_contribution);
app.use("/", otherRoutes);

export default app