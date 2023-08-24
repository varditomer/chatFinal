// Create an empty array to store user information
const users = [];

// Function to add a user to the chat
function userJoin(id, username, room) {
    console.log(`🚀 ~users.js (userJoin) ~ User: ${username}, with Id: ${id} is added to users in Room: ${room}..`);
    
    // Create a user object with id, username, and room
    const user = { id, username, room };
    
    // Add the user object to the users array
    users.push(user);
    
    // Return the user object
    return user;
}

// Function to remove a user from the chat when they leave
function userLeave(id) {
    // Find the index of the user with the given id in the users array
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        // If the user is found, remove them from the users array and return the removed user
        return users.splice(index, 1)[0];
    }
}

// Function to get all users in a specific room
function getRoomUsers(room) {
    // Filter the users array to get only users in the specified room
    const roomUsers = users.filter(user => user.room === room);
    return roomUsers
}

// Function to get the current user based on their id
function getCurrentUser(id) {
    // Find and return the user with the given id
    return users.find(user => user.id === id);
}

// Export the functions to make them accessible in other modules
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};