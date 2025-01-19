const errorHandler = (err, req, res) => {
    console.error("Error Occurred:", err.message);
  
    res.status(err.status || 500).json({
      error: {
        message: err.message || "Internal Server Error",
      },
    });
  };
  
  export default errorHandler;
  