const UserModel = require('../models/userModel')

const allVerifiedColleges = async (req, res) => {
    try {
        const colleges = await UserModel.find({ verified: true }).select("name email");
        const idx = colleges.findIndex(u => u.email === process.env.SUPER_ADMIN);
        if (idx !== -1) colleges.splice(idx, 1);
        console.log(colleges);
        
        return res.send({
            success: true,
            status: 200,
            value: colleges
        })
    } catch (error) {
        console.log(error)
    }
}

const allColleges = async (req, res) => {
    try {
        const colleges = await UserModel.find().select("name email verified createdAt");

        const idx = colleges.findIndex(u => u.email === process.env.SUPER_ADMIN);
        if (idx !== -1) colleges.splice(idx, 1);

        return res.status(200).send({
            success: true,
            value: colleges
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Server error" });
    }
};


module.exports = { allColleges, allVerifiedColleges };