import { mongoose } from "mongoose";

export const dbConect = async () => {
    await mongoose
        .connect(process.env.CONNECTION_URL)
        .then(() => console.log("Connected To Mongo Successfuly"))
        .catch((err) => console.error(err));
};
