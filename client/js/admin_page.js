async function getListUser(){
    try {
        const configHeader = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(`access_token`)}`
            }
        };
        const response = await axios.get('http://localhost:5000/auth/admin/user', configHeader);
    } catch (error) {
        console.log(error);
    }
}

async function handleLogout(){
    localStorage.removeItem('access_token');
    window.location.href = '../views/login.html';
}

getListUser();