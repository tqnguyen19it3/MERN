async function handleRegister(){
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let name = document.getElementById("name").value;

    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            name,
            email,
            password
        });
        if(response.status == 200){
            window.location.href = "../views/login.html";
        }
    } catch (error) {
        console.log(error);
    }
}