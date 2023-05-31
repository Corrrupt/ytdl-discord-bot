module.exports = function (description = "", files = [], color = null) {
    return {
        content: null,
        embeds:
            description === "Success"
                ? []
                : [
                      {
                          title: "File download",
                          description,
                          color,
                      },
                  ],
        files,
    };
};
