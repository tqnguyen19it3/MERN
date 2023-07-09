
function homeController() {
    return {
        // [GET] / HOME
        index(req, res) {
            res.status(200).send("home page");
        },
    }
}

module.exports = homeController