import * as localforage from "localforage";

const userStorage = localforage.createInstance({
    name:'userStorage'
})

export { userStorage }