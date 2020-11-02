const Error = () => {
    console.error({ err });
    res.status(400).json({
        status: "failed",
        message: `Profile cannot be updated.`,
    });
};