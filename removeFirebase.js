const { unlinkSync, writeFileSync, rmdirSync, write } = require("fs");
const pkg = require("./package.json");

// remove firebase utils
const utilsFiles = ["admin.js", "firebase.js", "useUser.js"];
for (const file of utilsFiles) {
  unlinkSync(`./utils/${file}`);
}

// remove utils if directory is empty
try {
  rmdirSync("./utils");
} catch {}

// remove example .env
unlinkSync(".env");

// remove UserContextProvider from _app.jsx
const newApp = `import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
`;

writeFileSync("./pages/_app.jsx", newApp);

// remove this script from package.json
delete pkg.scripts["remove-firebase"];
writeFileSync("./package.json", JSON.stringify(pkg, null, 2) + "\n");
