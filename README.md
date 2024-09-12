# Desmos-911OBJParser

A simple OBJ parser for Desmos 3D Calculator, using Typescript. It can parse 3D Models in .obj format to 2 lists `V` & `F` (supported custom names), respectively for vertices and faces, then output as a JSON Desmos expression list. Then you can use hacks (the "Console Snippets" may help) to insert the JSON into Desmos 3D Calculator, and write other expressions to process & render the 3D model with your own math wisdom.

Only simple triangle faces data are parsed.

Some package-level packaging are not finished yet, so the code can't be used as a library. Currently I'm using this project in a VSCode environment to parse a aircraft model for my short video ([awaits link]()) (btw that's also why the project is named with 911 ⏯️). You can clone the repo and run the code in the same VSCode environment.

## CLI Usage - Params

- \[2\]: OBJ file path
- `-v`: (Optional) Custom name for vertices list
- `-f`: (Optional) Custom name for faces list
- `-o`: (Optional) The output JSON file path. If not specified, the JSON will be printed to console.

## Environment Setup

1. Install Node.js 20

2. Install Dependencies

```bash
npm install
```

3. Run the code via the "Launch Program" task in VSCode (remember to configure CLI params in `.vscode/launch.json`!), or run the following command in terminal:

```bash
node dist/index.js <OBJ_FILE_PATH> -v <VERTICES_LIST_NAME> -f <FACES_LIST_NAME> -o <OUTPUT_JSON_FILE_PATH>
```

## Console Snippets

```javascript
// Since the setState() interpolation is unstable, we have to fallback to the official API to set expressions, with some manual work ahead.

// First, create a folder in the expressions list to store the data, with name ("Data" for example),
// and create 2 expressions in the folder as placeholders. They would be where "V" and "F" will be stored.

// Next, paste this line in the console and paste the huge JSON string following it.
exps=
//    ^(paste the JSON string here)

// Then, modify these params, then paste & run:
Calc = Calc				// Or whatever the environment is
folderTitle = "Data" 	// Or anything youve used 

// Main code --- paste & run finally
stateExps = Calc.getState().expressions.list
folderId = stateExps.find(e => e.type === "folder" && e.title === folderTitle).id
expIds = stateExps.filter(e => e.folderId === folderId).map(e => e.id).slice(-2)
exps = exps.map((exp, i) => ({...exp, "id": expIds[i]}))
Calc.setExpressions(exps)
```