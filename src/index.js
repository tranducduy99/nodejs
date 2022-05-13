const app = require('./app')
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


// const upload = multer({
//     dest: 'images'
// })
// app.post('/upload', upload.single('upload') ,(req, res) => {
//     res.send("success");
// })
// const Task = require("./models/task");
// const User = require("./models/user");
// const main = async () => {
//     // const task = await Task.findById("624fe7ba3b79445187499c75");
//     // await task.populate("owner").execPopulate();
//     // console.log(task);
//     const user = await User.findById("624fe505ebe83050bd4ce227");
//     await user.populate("tasks").execPopulate();
//     console.log(task);
// }
// main();
