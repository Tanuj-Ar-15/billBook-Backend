


const test = (req, res) => {

    const { email } = req.body
    try {


        return res.status(200).json({
            success: true,
            message: "Authentication successfull",
            user: email
        })
    } catch (error) {
        console.log("Error in auth Api: ", error);

        return res.status(400).json({
            success: false,
            message: "Error in authentication api",
            error
        })

    }
}


module.exports = { test }

