# Desmos-911OBJParser

A simple OBJ parser for Desmos 3D Calculator, using Typescript. It can parse 3D Models in .obj format to 2 lists `V` & `F` (supported custom names), respectively for vertices and faces, then output as a JSON Desmos expression list. Then you can use hacks (the "Console Snippets" may help) to insert the JSON into the Desmos 3D Calculator, and write other expressions to process & render the 3D model with your own math wisdom.

Only simple triangle faces data are parsed.

Some packaging is not done yet, so the code cannot be used as a library. Currently I'm using this project in a VSCode environment to parse an aircraft model for my short video ([awaits link]()) (btw that's also why the project is named with 911 ⏯️). You can clone the repo and run the code in the same VSCode environment.

## CLI Usage - Params

- \[2\]: OBJ file path
- `-v`: (Optional) Custom name for vertices list
- `-f`: (Optional) Custom name for faces list
- `-o`: (Optional) The output JSON file path. If not specified, the JSON will be printed to the console.

## Environment Setup

1. Install Node.js 20

2. Install Dependencies

```bash
npm install
```

3. Run the code via the "Launch Program" task in VSCode (remember to configure CLI params in `.vscode/launch.json`!), or run the following command in the terminal:

```bash
node dist/index.js <OBJ_FILE_PATH> -v <VERTICES_LIST_NAME> -f <FACES_LIST_NAME> -o <OUTPUT_JSON_FILE_PATH>
```

4. You will get a JSON of 2 expressions, representing the two datasets. Apply it in your own way, or refer to the following section "Console Snippets" for guidance.

## Console Snippets

Only for reference:

```javascript
// Since the setState() interpolation is unstable, we have to fall back to the official API to set expressions.
// This requires some manual work before application:

// First, create 2 variables where "V" and "F" datasets will be stored.
// Put them in a folder and name it "Data" (for example)

// Next, paste this line in the console and then paste the huge JSON string right after it.
exps=
//    ^(paste the JSON here)

// Then, edit the parameters and paste & run:
Calc = Calc				    // Depends on the environment. In Desmos Official Site it's assigned in the global variable "Calc".
folderTitle = "Data" 	// Or whatever name you used on the folder containing the 2 datasets.

// Then here's my Main code --- paste & run it at last
stateExps = Calc.getState().expressions.list
folderId = stateExps.find(e => e.type === "folder" && e.title === folderTitle).id
expIds = stateExps.filter(e => e.folderId === folderId).map(e => e.id).slice(-2)
exps = exps.map((exp, i) => ({...exp, "id": expIds[i]}))
Calc.setExpressions(exps)
```
