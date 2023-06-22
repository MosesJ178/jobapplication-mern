import mongoose from "mongoose";

const keywordsSchema = new mongoose.Schema({
    keywords:[String]
})

const Keyword = mongoose.model("Keyword",keywordsSchema);

export default Keyword;