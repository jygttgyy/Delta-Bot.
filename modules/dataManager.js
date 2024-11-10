import fs from 'fs'
import path from 'path'

let data = {
    robloxIDs: {},
    coins: {},
    baltop: []
}
let cooldowns = []
const Cooldown = (userID) => {
    if (cooldowns.includes(userID) !== -1) return true
    cooldowns.push(userID)
    setTimeout(cooldowns.shift, 500)
    return false
}
export const GetData = (type, userID) => data[type][userID]
const dataFolder = path.join(process.cwd(), 'data')
export const SetData = (type, userID, data) => {
    data[type][userID] = data
    if (Cooldown(userID)) return
    let folder = path.join(dataFolder, 

}
