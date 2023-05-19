
function homeController() {
    return {
        // [GET] / HOME
        index(req, res) {
            res.send("home page");
        },
    }
}

module.exports = homeController