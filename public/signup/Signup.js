async function signup(event) {
    try{
        event.preventDefault();
        const signupDetails = {
            name : event.target.name.value,
            email : event.target.email.value,
            password : event.target.password.value,
            phNo: event.target.phonenumber.value
        }

        document.getElementById('Name').value="";
        document.getElementById('Email').value="";
        document.getElementById('Password').value="";
        document.getElementById('phno').value="";
        
        const response = await axios.post('http://localhost:3000/user/signup',signupDetails);
        if(response.status === 201){ 
           alert(response.data.message);
           // redirecting the user on successful signup
           window.location.href = '../Login/login.html'
        } else if(response.status === 200){
            alert(response.data.message);
        } else {
        throw new Error('Failed to login')
        }
    } catch(err) {
        document.body.innerHTML += `<div style="color:red;">${err} </div>`;
    }
}