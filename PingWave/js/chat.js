import { supabase } from './env.js';
import { createToast, removeToast } from '../toast/script.js'

getallmessages();

const username = document.getElementById("username");
username.innerHTML = localStorage.getItem("usernamechatroom");

const roomname = document.getElementById("roomname");
roomname.innerHTML = localStorage.getItem("roomname");

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

async function getallmessages() {
    const { data, error } = await supabase
    .from('messages') 
    .select()
    .eq('chatroom_id', localStorage.getItem("roomid"))
    .order('created_at', {ascending: true})
    .limit(10);


    for(let i=0; i<data.length; i++){
        messages(data[i]['content'], data[i]['user_id'], data[i]['created_at'], data[i]['message_id']);
    }

    if(error) {
        createToast("error", "getmessages error");
    }

}

async function messages(content, userid, time, message_id) {
    let li = document.createElement("li");
    let ul = document.getElementById("message_list");
    ul.innerHTML='';
    let span = document.createElement("span");
    li.innerHTML = content;
    li.setAttribute("order", message_id)
    
    const { data, error } = await supabase
    .from('users')
    .select()
    .eq('user_id', userid);
    let username=data[0]['username'];
    span.innerHTML = time.substr(11,5) + ' | '  + username;


    if(username==localStorage.getItem("usernamechatroom")) {
        li.setAttribute("class", "right");
        span.setAttribute("class", "rightdate");
        ul.appendChild(li);
        ul.appendChild(span);
    }else {
        li.setAttribute("class", "left");
        span.setAttribute("class", "leftdate");
        ul.appendChild(li);
        ul.appendChild(span);
    }


    var objDiv = document.getElementById("messages");
    objDiv.scrollTop = objDiv.scrollHeight;
    
}
