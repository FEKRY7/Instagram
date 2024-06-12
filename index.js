const express = require('express');

const userRouter = require('./src/modules/auth/auth.routes.js')
const ProfileRouter = require('./src/modules/profile/profile.routes.js')


const mongoConnection = require('./Database/dbConnection.js');
const dotenv = require('dotenv');
const cors = require('cors');


 
dotenv.config()
const app = express()
mongoConnection();
//convert Buffer Data
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())


  
// Routes
app.use('/api/auth',userRouter)
app.use('/api/Profile',ProfileRouter)
 


// Set up server to listen on specified port (default to 3000)
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// 404 route
app.use('*', (req, res) => {
    res.status(404).json({ 'Msg': 'I Can\'t Found' });
});
