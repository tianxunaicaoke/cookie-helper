const templateTags = [
  {
    name: "apitoken",
    displayName: "Concat-Cookies",
    description: "Concats the specific cookie key/value",
    args: [
      {
        displayName: "Seperator",
        description:
          "The path of the token from the response separated by dots",
        type: "string",
        defaultValue: ";",
      },
      {
        displayName: "Cookie keys",
        description: "Comman separated keys of cookies to combine",
        type: "string",
        defaultValue: "",
      },
    ],
    async run(context, seperator, keys) {
      const cookieKeys = keys.split(",").map((x) => x.trim());
      const { meta } = context;

      if (!meta.requestId || !meta.workspaceId) {
        return null;
      }

      const workspace = await context.util.models.workspace.getById(
        meta.workspaceId
      );

      if (!workspace) {
        throw new Error(`Workspace not found for ${meta.workspaceId}`);
      }

      const cookieJar = await context.util.models.cookieJar.getOrCreateForWorkspace(
        workspace
      );

      // console.log(JSON.stringify(cookieKeys));
      const result = [];
      for (const cookie of cookieJar.cookies) {
        const key = cookie.key.trim();
        console.log(`current key: ${key}`);
        if (cookieKeys.includes(key)) {
          result.push(`${cookie.key}=${cookie.value}`);
        }
      }
      const final = result.join(seperator);
      console.log(final);
      return final;
    },
  },
];

module.exports = { templateTags };
