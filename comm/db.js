var mongoose = require("mongoose");
const url="mongodb://localhost:27017/movie";
mongoose.connect(url);
module.exports=mongoose;