export default {
    set: (name, value) => {
        if (typeof value === 'object') {
            localStorage.setItem(name, JSON.stringify(value));
        } else {
            localStorage.setItem(name, value);
        }
    },
    get: async (name) => {
        const value = await localStorage.getItem(name);
        return JSON.parse(value);
    },
    remove: async (name) => {
        localStorage.removeItem(name)
    }
}