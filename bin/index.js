#! /usr/bin/env node
const {execSync} = require("child_process");
const fs = require("fs");
// const name = process.argv[2];
// const UName = name.replace(/\b\w/g, (char) => char.toUpperCase()).replace(/\s+/g, "");
// const args = process.argv.slice(2);

// const fileType = args[1]?.slice(2);
// const isJS = fileType === "js";

const showLoading = () => {
	const spinner = ["|", "/", "-", "\\"];
	let i = 0;
	return setInterval(() => {
		process.stdout.write(`\r${spinner[i]} Loading...`);
		i = (i + 1) % spinner.length;
	}, 100);
};

const hideLoading = (loadingInterval) => {
	clearInterval(loadingInterval);
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	console.log("\x1b[32m", "Done!");
	console.log("\x1b[36m", "Happy Coding");
	console.log("\x1b[34m", "And Don't Forget!!! You are great");
};

// fs.mkdirSync(`./${name}`);

// const component = `import React from 'react';
// import {View, Text} from 'react-native';${isJS ? "" : "\n"}
// ${!isJS ? "import {StackScreenProps} from '@react-navigation/stack';" : ""}${isJS ? "" : "\n"}
// import styles from './styles';
// ${!isJS ? `\ntype Props = StackScreenProps<,"${UName}">;` : ""}
// const ${UName}${isJS ? "" : ": React.FC<Props>"} = () => {
//   return (
//     <View>
//       <Text>${UName}</Text>
//     </View>
//   );
// };

// export default ${UName};
// `;

// fs.writeFile(`./${name}/${UName}${isJS ? ".js" : ".tsx"}`, component, function (err) {
// 	if (err) {
// 		return console.log(err);
// 	}
// });

// const styles = `import {StyleSheet} from 'react-native';

// export default StyleSheet.create({});
// `;

// fs.writeFile(`./${name}/styles${isJS ? ".js" : ".ts"}`, styles, function (err) {
// 	if (err) {
// 		return console.log(err);
// 	}
// });

// const index = `export {default as ${UName}} from './${UName}';
// `;

// fs.writeFile(`./${name}/index${isJS ? ".js" : ".ts"}`, index, function (err) {
// 	if (err) {
// 		return console.log(err);
// 	}
// });

// Function to parse command-line arguments
function parseArgs(args) {
	const options = {};
	for (let i = 0; i < args.length; i++) {
		if (args[i].startsWith("--")) {
			const key = args[i].substring(2);
			const value = args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true;
			options[key] = value;
			if (value !== true) i++; // Skip the next argument if it's a value
		} else if (args[i].startsWith("-")) {
			const key = args[i].substring(1);
			const value = args[i + 1] && !args[i + 1].startsWith("-") ? args[i + 1] : true;
			options[key] = value;
			if (value !== true) i++; // Skip the next argument if it's a value
		}
	}
	return options;
}

// Parse the command-line arguments
const args = process.argv.slice(2);
const options = parseArgs(args);

const packageName = options["package-name"];
const prevVersion = options["current-version"];
const newVersion = options["update-version"];
const currentDir = process.cwd();
const loading = showLoading();
try {
	console.log("Installing package");
	execSync(`yarn add ${packageName}@${prevVersion}`);

	console.log("Trying to fetch package");
	process.chdir(`node_modules/${packageName}`);

	console.log("Initializing repo");
	result = execSync('git init && git add . && git commit -m "Initial commit for prev version"');

	console.log(`Patching package`);
	process.chdir(currentDir);
	result = execSync(`npx patch-package`);

	console.log("Creating diff");
	fs.mkdirSync("diff");
	process.chdir(`node_modules/${packageName}`);
	result = execSync(`git diff > ${currentDir}/diff/package.diff`);

	console.log("Installing new version");
	process.chdir(currentDir);
	execSync(`yarn add ${packageName}@${newVersion}`);

	console.log("Initializing new repo");
	process.chdir(`node_modules/${packageName}`);
	result = execSync('git init && git add . && git commit -m "Initial commit for new version"');

	console.log("Applying diff");
	execSync(`git apply --reject --whitespace=fix --allow-empty ${currentDir}/diff/package.diff`);

	console.log("Cleaning up");
	execSync("rm -rf .git");
	process.chdir(currentDir);
	execSync("rm -rf diff");

	console.log("Creating patch");
	result = execSync(`npx patch-package ${packageName}`);
} catch (error) {
	console.error(`Error executing command: ${error.message}`);
	try {
		console.log("Cleaning up");
		execSync("rm -rf .git");
		process.chdir(currentDir);
		execSync("rm -rf diff");

		console.log("Creating patch");
		result = execSync(`npx patch-package ${packageName}`);
	} catch (error) {
	} finally {
		hideLoading(loading);
	}
}

// Run yarn
// exec("yarn", (error, stdout, stderr) => {
// 	if (error) {
// 		console.error(`Error running yarn: ${error}`);
// 		return;
// 	}
// 	console.log(`yarn output: ${stdout}`);
// 	console.error(`yarn errors: ${stderr}`);
// });
