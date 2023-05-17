
function homeController() {
    return {
        // [GET] / HOME
        index(req, res) {
            res.send("home 123");
        },
    }
}

module.exports = homeController