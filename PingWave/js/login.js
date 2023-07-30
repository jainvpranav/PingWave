import { supabase } from './env.js';
import { createToast, removeToast } from '../toast/script.js'

const luser = document.getElementById("luser");
const lpass = document.getElementById("lpass");
const suser = document.getElementById("suser");
const spass = document.getElementById("spass");
const loginbtn = document.getElementById("login");
const signupbtn = document.getElementById("signup");

luser.addEventListener("click", (e)=> {
    document.getElementById("loginform").style.opacity=1;
    document.getElementById("signupform").style.opacity=0.2;
})
suser.addEventListener("click", (e)=> {
    document.getElementById("signupform").style.opacity=1;
    document.getElementById("loginform").style.opacity=0.2;
})


let username1="Amigo";

loginbtn.addEventListener("click", (e) => {
    e.preventDefault();
    if(isemail(luser)) {
        searchdata();
    }
});

signupbtn.addEventListener("click", (e) => {
    e.preventDefault();
    if(isemail(suser)) {
        username1 = suser.value.replace(/@.*/, '');
        insertdata();
    }
})

const isemail = (email) => {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!email.value.match(mailformat)){
        createToast("warning", "Email Address Invalid");
        return false;
    }
    else return true
}


async function searchdata() {
    const { data, error } = await supabase
    .from('users')
    .select('*')
    .match({email: luser.value, password: CryptoJS.MD5(lpass.value).toString()})

    if(data.length<=0 || error) {
        createToast("error", "Incorrect credentials");
    }

    if(data.length > 0 && !error) {
        createToast("success", "Welcome");
        const usernamechatroom = data[0]['username'];
        const useridchatroom = data[0]['user_id'];
        localStorage.setItem("usernamechatroom", usernamechatroom);
        localStorage.setItem("useridchatroom", useridchatroom);
        setInterval(() => {window.location.replace("../html/chatrooms.html");}, 1800); clearInterval();
        clearvalue(luser, lpass);
    } 
}


async function insertdata() {
    const { error } = await supabase
    .from('users')
    .insert({ username: username1, email: suser.value, password: CryptoJS.MD5(spass.value).toString()})
    if(!error){ 
        createToast("success", "Welcome Aboard!"); setInterval(() => {window.location.replace("./index.html");}, 3300); clearInterval(); 
    }
    if(error) createToast("error", "Sorry! Try Again!!");
    clearvalue(suser, spass, username1);

}


const clearvalue=(a,b, c=null) => {
    a.value=''
    b.value=''
    if(c!=null)
    c.value=''
}