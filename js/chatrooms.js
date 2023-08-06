import { supabase } from './env.js';
import { createToast, removeToast } from '../toast/script.js'

const usernamechatroom = localStorage.getItem("usernamechatroom");
const useridchatroom = localStorage.getItem("useridchatroom");

const username = document.getElementById("username");

if(usernamechatroom!='') { 
    username.innerHTML += usernamechatroom;
}

const chatrooms = document.getElementById("chatrooms");

async function searchdata() {
    const { data, error } = await supabase
    .from('user_chatroom')
    .select()
    .eq('user_id', useridchatroom)

    for(let i=0; i<data.length; i++) {
        chatroomsli(data[i]['chatroom_id']);
    }

    if(error){
        createToast("error", "Couldn't fetch Data");
    } 
}

async function chatroomsli(chatroom_id) {
    chatrooms.innerHTML='';

        const {data, error} = await supabase 
        .from('chatroom')
        .select()
        .eq('chatroom_id', chatroom_id)
        .single()

        let li=document.createElement("li");
        li.setAttribute("id", chatroom_id);
        li.setAttribute("onclick", "nextPage(this.id, this.innerHTML)");
        li.innerHTML = data['name'];
        chatrooms.appendChild(li);

        if(error) {
            createToast("error", "chatroomsli error");
        }
}


searchdata();

const roomname = document.getElementById("roomname");
const description = document.getElementById("description");
const create = document.getElementById("create");



create.addEventListener("click", (e)=> {
    e.preventDefault();
    if(description.value=='' || description.value==/\s/){
        description.value='A chatroom for all the fun convos'
    }
    if(notempty(roomname.value)) {
        insertdata();
        clearvalue(roomname, description); 
    } else {
        clearvalue(description);
        createToast("warning", "Enter roomname")
    }
})

const notempty = (val) => {
    var notemptyregex = /^\s*$/;
    if(!val.match(notemptyregex)) {
        return true;
    } else return false;
}


async function insertdata() {
    const { data, error } = await supabase
    .from('chatroom')
    .insert({ name: roomname.value, description: description.value, user_id: useridchatroom })
    .select()

    if(!error){ 
        createToast("success", "Chatroom Created"); 
        const { error1 } = await supabase
        .from('user_chatroom')
        .insert({user_id: data[0]['user_id'], chatroom_id: data[0]['chatroom_id']})

        if(error1) {
            createToast("error", "Fatal Error");
        }

    }
    searchdata();
}

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
    window.localStorage.clear();
    window.location.reload(true);
    window.location.replace('../index.html');
});