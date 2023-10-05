// Function to load data from localStorage.
function load(key) {
    var val = localStorage.getItem(key)
    return val ? JSON.parse(val) : null
}

// Function to save data from localStorage.
function save(key, val) {
    localStorage[key] = JSON.stringify(val)
}

// Function to remove data from localStorage.
function remove(val) {
    localStorage.removeItem(val)
}

export const storageService = {
    load,
    save,
    remove
}
