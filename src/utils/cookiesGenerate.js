exports.cookieGenerate = (token, res) => {
  try {
    res.cookie("userToken", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      httpOnly: true,  
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict" 
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Failed to set cookie",
      error: error.message || "Unknown error"
    });
  }
};
