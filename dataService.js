let redisClient;
var users = {};
const usersKey = 'users';

async function loadUsers() {
    const usersJSON = await redisClient.get(usersKey);
    users = usersJSON ? JSON.parse(usersJSON) : {};
}

async function saveUsers() {
    await redisClient.set(usersKey, JSON.stringify(users));
}

function registerUser(msg) {
    var uid = msg.chat.id;
    var usr = {enabled: true, data: {from: msg.from, chat: msg.chat}};
    users[uid] = usr;
    saveUsers();
}

function getUser(uid) {
    return users[uid];
}

function getUserList() {
    return Object.keys(users);
}

function setMetaData(uid, key, val) {
    users[uid].data[key] = val;
    saveUsers();
}

function getMetaData(uid, key) {
    return users[uid].data[key];
}

function assertCounter(uid, id) {
    if(users[uid]) {
        if(users[uid].counter) {
            if(users[uid].counter[id]) {
                if("value" in users[uid].counter[id]) {
                    return true;
                }
                else {
                    users[uid].counter[id].value = 0;
                }
            }
            else {
                users[uid].counter[id] = {};
                users[uid].counter[id].value = 0;
                saveUsers();
            }
        }
        else {
            users[uid].counter = {};
            if(users[uid].count && id == '0') {//old counter detected, migrate count
                users[uid].counter[id] = {value: users[uid].count};
                delete users[uid].count;
            }
            else {
                users[uid].counter[id] = {};
                users[uid].counter[id].value = 0;
            }
            saveUsers();
        }
    }
    else {
        //console.log("[ERROR] User ID", uid, "does not exist in database");
        var usr = {enabled: true, data: {from: undefined, chat: undefined, error: "user was not initialized properly"}, counter: {"0": {"value": 1}}};
        users[uid] = usr;
        saveUsers();
    }
}

function setCounter(uid, id, val) {
    try {
        assertCounter(uid, id);
        users[uid].counter[id].value = val;
        saveUsers();
    }
    catch(e) {
        console.error('setCounter failed for', {uid, id, val});
    }
}

function getCounter(uid, id) {
    assertCounter(uid, id);
    try {
        return users[uid].counter[id].value;
    }
    catch (e) {
        return 0;
    }
}

function getAllCounters(uid) {
    assertCounter(uid, '0');
    return users[uid].counter;
}

const initialize = async () => {
    redisClient = require("redis").createClient({url: process.env.REDISTOGO_URL});
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    await redisClient.connect();  
    await loadUsers();
};

module.exports = {
    initialize,
    loadUsers,
    registerUser,
    getUserList,
    setMetaData,
    getMetaData,
    setCounter,
    getCounter,
    getAllCounters
};
