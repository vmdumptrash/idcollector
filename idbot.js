const DiscordJS = require('discord.js');
TOKEN = "ODIyNjQ4NzQzNDkyMDU5MTY5.YFYpwA.J2iKk4kK5z-ffMQS3doA4zPqbs8"
TOKEN = process.argv[2]

const BinarySearchTree = require('binary-search-tree').BinarySearchTree

const valid_chars = "abcdefghijklmnopqrstuvwxyzäüöß?/\()[]}{!0123456789 €";
KONTROLLZENTRALE = ["777176482778841098", "777177353532473396", "333165554070192128"]

const client = new DiscordJS.Client;

collectedIDs = new BinarySearchTree();

client.on('ready', async()=> {
    console.log(`Ready! (${client.user.username})`)
    client.guilds.get(KONTROLLZENTRALE[0]).channels.get(KONTROLLZENTRALE[1]);
})

client.on('message', async(msg) => {

    if(msg.guild.id == KONTROLLZENTRALE[0] && msg.author.id == KONTROLLZENTRALE[2]) {
        args = msg.content.split(" ");

        if(args[0] == "collect") {
            console.log("I'll go collect some")

            let guildID = args[1];
            let guild = client.guilds.get(guildID)

            for (let index = 0; index < valid_chars.length; index++) {
                try {
                    const element = valid_chars[index];
                    await collect_ids(guild, element)   
                } catch (error) {  
                }
            }
        }

        if(args[0] == "print") {
            printIDs(msg)
        }
    }
})

const printIDs = (msg) => {
    array = []
    appendToArray(collectedIDs, array)
    console.log(`\nID count: ${array.length}`)
        
    ids = ""

    array.forEach((key)=> {
        ids += key+"\n";
    })

    buffer = Buffer.from(ids, 'utf-8')
    msg.channel.send(new DiscordJS.Attachment(buffer, "all_collected_uids.txt"))
}

const collect_ids = async(guild, string) => {
    let countBefore = collectedIDs.getNumberOfKeys();
    await guild.fetchMembers(string, 400)
    guild.members.forEach(member => {
        if(!member.user.bot) {
            collectedIDs.insert(member.user.id, member.user);
        }
    })
    let countAfter = collectedIDs.getNumberOfKeys();
    let diff = countAfter - countBefore;
    if(diff > 0) {
        console.log(`\nFound ${diff} at ${string}\n`)
        for(let i=0;i<valid_chars.length;i++) {
            try {
                await collect_ids(guild, string + valid_chars.charAt(i))   
            } catch (error) {
                
            }
        }
    }else {
        process.stdout.write("\rHit a road block at: "+string);
    }
}

const appendToArray = (bst, array) => {
    if(bst.key != undefined) {
        if(bst.left != null)
            bst.left.appendToArray(array)
        array.push(bst.key)
        if(bst.right != null)
            bst.right.appendToArray(array)
      }
}

client.login(TOKEN)