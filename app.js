const templateTags = [
  {
    name: "apitoken",
    displayName: "Cookie-helper",
    description: "help user to get token from cookie jar",
    args: [
      {
        displayName: "Seperator",
        description:
          "The path of the token from the response separated by dots",
        type: "string",
        defaultValue: "; ",
      },
      {
        displayName: "Cookie keys",
        description: "Comman separated keys of cookies to combine",
        type: "string",
        defaultValue: "reauinf,reautok",
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

      console.log("hello xun1");
      const result = [];
      
      for(cookieKey of cookieKeys){
        for (const cookie of cookieJar.cookies) {
          const key = cookie.key.trim();
          console.log(`current key: ${key}`);
          if (cookieKey == key) {
            result.push(`${cookie.key}=${cookie.value}`);
          }
        }
      }
      
      const final = result.join(seperator);
      console.log(result);
      return final;
    },
  },
];

module.exports = { templateTags };
