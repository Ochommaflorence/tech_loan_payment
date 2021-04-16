import express from "express";
import logger from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from './route';


dotenv.config();
  mongoose.connect(
        process.env.DB_HOST,{
            useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true
        }
  );

  const db = mongoose.connection;

  db.on("error",(err) => {
      console.log(err);
  });

  db.once("open", () =>{
      console.log("Database connected");
  })

 const app = express;
 const port = 7500;
 
 
 app.use(logger("dev"));
 app.use(express.urlencoded({ extended: true }));
 app.use(express.json());
 app.use(routes);


 const port =parseInt(process.env.PORT, 10 || 7500)
 app.set("port", port);

 app.listen(port, () =>{
     console.log(`server running on port ${port}`)
 })

 export default app;