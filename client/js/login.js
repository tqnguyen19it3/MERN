async function handleLogin(){
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email,
            password
        });
        if(response.status == 200){
            const accessToken = response.data.accessToken;
            //decoded get info in payload
            const payloadDecoded = jwt_decode(accessToken);
            
            payloadDecoded.role === 'regular' ? (window.location.href = "../views/home_page.html") : (window.location.href = "../views/admin_page.html");
            
            //save accesstoken to client
            localStorage.setItem("access_token", accessToken);
        }
    } catch (error) {
        console.log(error);
    }
}