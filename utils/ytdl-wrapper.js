const ytdl = require("youtube-dl-exec");
const path = require("path");
const { unlink } = require("fs");

module.exports = async function (URL) {
    try {
        const output = await ytdl(URL, {
            extractAudio: true,
            audioFormat: "mp3",
            o: path.join(__dirname, "..", "downloads", "%(title)s-%(id)s.%(ext)s"),
            printJson: true,
        });

        if (output.failed === true) throw output;

        let output_path = output["_filename"];
        const splitOnPeriod = output_path.split(".");
        output_path = output_path.replace(splitOnPeriod[splitOnPeriod.length - 1], "mp3");

        setTimeout(() => {
            unlink(output_path, (err) => {
                if (err) console.log(err);
            });
        }, 5000);

        return { success: true, result: output_path };
    } catch (error) {
        const errorMessage = error.message || undefined;
        console.log(errorMessage);
        if (errorMessage.includes("HTTP Error 404")) return { success: false, result: "404 Not Found" };
        else if (errorMessage.includes("Unable to download webpage"))
            return { success: false, result: "Unable to download webpage" };
        else if (errorMessage.includes("Unsupported URL")) return { success: false, result: "Unsupported URL" };
        else if (errorMessage.includes("not a valid URL"))
            return {
                success: false,
                result: "URL is not valid. Make sure it follows this format:\nhttps://example.com",
            };
        else return { success: false, result: "Unknown error occured" };
    }
};
