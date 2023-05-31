const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});
const config = require("./config.json");

// CUSTOM YTDL WRAPPER
const ytdl = require("./utils/ytdl-wrapper");

// CUSTOM EMBED DESIGN
const createEmbed = require("./utils/createEmbed");

// TIMEOUT SET
const timeoutSet = new Set();

// CONSTANTS
const PREFIX = config["prefix"];
const CMD_NAME = config["name"];
const TIMEOUT_MS = config["timeoutMS"];

// REGEX
const cmdRegex = new RegExp(`^${PREFIX}${CMD_NAME}( +)`, "i");
const urlRegex =
    /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?!&//=]*)/gi;

client.on("messageCreate", async (msg) => {
    if (cmdRegex.test(msg.content)) {
        if (timeoutSet.has(msg.author.id)) {
            const timeoutMessage = await msg.reply(createEmbed(`You must wait ${TIMEOUT_MS / 1000} seconds...`));
            setTimeout(() => {
                timeoutMessage.delete();
                msg.delete();
            }, TIMEOUT_MS);
            return;
        }

        timeoutSet.add(msg.author.id);

        setTimeout(() => {
            timeoutSet.delete(msg.author.id);
            try {
            } catch {}
        }, TIMEOUT_MS);

        const args = msg.content.replace(cmdRegex, "");
        const downloadURLs = args.match(urlRegex);

        msg.reply(createEmbed("Attempting to download file"))
            .then(async (replyMessage) => {
                if (downloadURLs === null) {
                    return replyMessage.edit(createEmbed("You provided no URL"));
                }

                const { success, result } = await ytdl(downloadURLs[0], replyMessage);

                if (success) {
                    return replyMessage.edit(createEmbed("Success", [result]));
                } else {
                    return replyMessage.edit(createEmbed(result));
                }
            })
            .catch(console.error);
    }
});

client.on("ready", function () {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config["token"]);
