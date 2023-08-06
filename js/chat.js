import { supabase } from './env.js';
import { createToast, removeToast } from '../toast/script.js'

getallmessages();

const username = document.getElementById("username");
username.innerHTML = localStorage.getItem("usernamechatroom");

const roomname = document.getElementById("roomname");
roomname.innerHTML = localStorage.getItem("roomname");

async function description() {
    const { data, error } = await supabase
    .from('chatroom')
    .select()
    .eq('name', localStorage.getItem("roomname"))
    
    const description = document.getElementById("description");
    description.innerHTML = data[0]['description'];
    
}
description();

const create = document.getElementById("create");
const newuserinput = document.getElementById("newuserinput");
create.addEventListener("click", (e)=> {
    e.preventDefault();
    if(notempty(newuserinput.value)) {
        insertdata();
        clearvalue(newuserinput); 
    }
})

var newuserid;
async function insertdata() {
    const { data, errorr } = await supabase
    .from('users')
    .select()
    .eq('username', newuserinput.value)
    .single()

    if(errorr) {
        createToast("error", "searchusererror")
    } if(data) newuserid = data['user_id'];
    
    const { adata, error } = await supabase
    .from('user_chatroom')
    .insert({ 'user_id': newuserid, 'chatroom_id': localStorage.getItem("roomid") })
    .select()
    if(error['code']=="23505") {
        createToast("warning", "User Already Present");
    }
    if(!error){ 
        createToast("success", "User Added"); 
        members();
    } 
    if(error['code']!="23505") {
        createToast("error", "User not present");
    }
}

const notempty = (val) => {
    var notemptyregex = /^\s*$/;
    if(!val.match(notemptyregex)) {
        return true;
    } else return false;
}

const member_list = document.getElementById("member_list");
async function members() {
    member_list.innerHTML='';

    const {data, error} = await supabase
    .from('user_chatroom')
    .select()
    .eq('chatroom_id', localStorage.getItem("roomid"))
    
    for(var i=0; i<data.length; i++) {
        memberlist(data[i]['user_id']);
    }
}

async function memberlist(id) {
    const { data, error } = await supabase
    .from('users')
    .select()
    .eq('user_id', id)

    let li = document.createElement("li");
    li.innerHTML = data[0]['username'];
    member_list.appendChild(li);
}

members();


const clearvalue=(a,b, c=null) => {
    if(a!=null)
    a.value=''
    if(b!=null)
    b.value=''
    if(c!=null)
    c.value=''    
}

const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
    window.location.reload(true);
    window.location.replace('../html/chatrooms.html');
});



/////////////////////////Message code //////////////////////////

const messagetext = document.getElementById("messagetext");
const sendbtn = document.getElementById("sendbtn");

sendbtn.addEventListener("click", async (e)=>  {
    e.preventDefault();
    if(notempty(messagetext.value)) {
        const { data, error } = await supabase
        .from('messages')
        .insert({ 'chatroom_id': localStorage.getItem("roomid"), 'user_id': localStorage.getItem("useridchatroom"), 'content': messagetext.value})
        .select()
    
        if(error) {
            createToast("error", "SendText Error");
        }
        getallmessages();
        clearvalue(messagetext);
    }
    
});
messagetext.addEventListener("keypress", async (e)=>  {
    if(e.key==="Enter") {
        e.preventDefault();
        if(notempty(messagetext.value)) {
            const { data, error } = await supabase
            .from('messages')
            .insert({ 'chatroom_id': localStorage.getItem("roomid"), 'user_id': localStorage.getItem("useridchatroom"), 'content': messagetext.value})
            .select()
        
            if(error) {
                createToast("error", "SendText Error");
            }
            clearvalue(messagetext);
            getallmessages();
        }
    }
});

async function getallmessages() {
    let ul = document.getElementById("message_list");
    ul.innerHTML='';
    const { data, error } = await supabase
        .from('messages') 
        .select()
        .eq('chatroom_id', localStorage.getItem("roomid"))
        .order('created_at', {"ascending": false})
        .limit(10)

    if (error) {
        createToast("error", "getmessages error");
        return;
    }
    for (let i = data.length-1; i >=0; i--) {
        messages(data[i]['content'], data[i]['user_id'], data[i]['created_at'], data[i]['message_id']);
    }
}

async function messages(content, userid, time, message_id) {
    const { data, error } = await supabase
        .from('users')
        .select()
        .eq('user_id', userid);

    let username = data[0]['username'];

    if (username == localStorage.getItem("usernamechatroom")) {
        append(content, time, username, "right", "rightdate", message_id);
    } else {
        append(content, time, username, "left", "leftdate", message_id);
    }

}

function append(content, time, username, alignli, alignspan, message_id) {
    let ul = document.getElementById("message_list");
    let li = document.createElement("li");
    let span = document.createElement("span");
    li.innerHTML = content;
    span.innerHTML = time.substr(11, 5) + ' | ' + username;
    li.setAttribute("value", message_id)
    span.setAttribute("value", message_id)
    li.classList.add("message-item", alignli);
    span.setAttribute("class", alignspan);
    ul.classList.add("fade-in");
    ul.appendChild(li);
    ul.appendChild(span);
    sortAndReappend();
}

function sortAndReappend() {
    let ul = document.getElementById("message_list");
    let items = Array.from(ul.children);
    items.sort((a, b) => b.getAttribute("value") - a.getAttribute("value"));
    ul.innerHTML = "";   
    items.forEach(item => ul.appendChild(item));
}
