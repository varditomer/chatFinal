const users=[];
//join user to chat
function userJoin(id,username,room){
    const user={id,username,room};
    console.log(`user:`, user)
    users.push(user);
    console.log(`users:`, users)
    return user;
}


//user leavs chat
function userLeave(id){
    const index= users.findIndex(user => user.id===id);

    if(index!==-1){
        return users.splice(index,1)[0];
        
    }
}

//get room users
function getRoomUsers(room){
    return users.filter(user=>user.room===room);
}

//get current user
function getCurrentUser(id){
    console.log(`id:`, id)
    console.log(`users:`, users)
    return users.find(user =>user.id ===id);
}

module.exports={
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};