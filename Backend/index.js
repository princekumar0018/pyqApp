const express = require('express');
const { StudentUploadRouter } = require('./routes/StudentuploadPyq.routes');
const { AdminUploadRouter } = require('./routes/AdminUpload.routes');
const { SearchRouter } = require('./routes/searchRouter.route');
const { AdminSearchRouter } = require('./routes/AdminDownload.routes');
const { userRouter } = require('./routes/User.routes');
const { superadminRouter } = require('./routes/SuperAdmin.routes');
const { AdminVerifyRouter } = require('./routes/AdminVerifyRouter.routes');
require('dotenv').config();
const app = express();
const cors = require('cors');

// Database connection helper
const connectToDatabase = require('./config/bdUser');
const { toolsRouter } = require('./routes/Tools.route');
const { meetRouter } = require('./routes/Meet.routes');
connectToDatabase();
const port = process.env.PORT || 4000;


app.use(cors('*'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send({ message: "✅ Server is working!" });
});

app.use('/student', StudentUploadRouter);

app.use('/adminupload', AdminUploadRouter);
app.use('/admindownload', AdminSearchRouter);
app.use('/adminverifydownload', AdminVerifyRouter);
app.use('/search', SearchRouter);

app.use('/user', userRouter);
app.use('/superadmin', superadminRouter);
app.use('/tools', toolsRouter)
app.use('/meet', meetRouter)



app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
