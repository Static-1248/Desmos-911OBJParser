import * as fs from 'fs';
import * as path from 'path';

interface OBJData {
	vertices: number[][];
	faces: number[][];
}

type Expression = {
	[key: string]: any;
}

class OBJParser {

	// 读取OBJ文件并解析数据
	public async parseOBJ(data: string): Promise<OBJData> {
		return new Promise((resolve, reject) => {
			const vertices: number[][] = [];
			const faces: number[][] = [];
			
			// 逐行解析数据
			const lines = data.split('\n');
			for (const line of lines) {
				const parts = line.trim().split(/\s+/);
				if (parts.length === 0) {
					continue;
				}

				// 解析顶点
				if (parts[0] === 'v') {
					vertices.push(parts.slice(1).map((v) => parseFloat(v)));
				}

				// 解析面
				if (parts[0] === 'f') {
					const face = parts.slice(1).map((v) => {
						const index = parseInt(v.split('/')[0]);
						return index;
					})
					faces.push(face);
				}
			}

			resolve({ vertices, faces });
		});
	}

	// 转换为LaTeX格式字符串
	public toExpressions(data: OBJData, vName: string = 'V', fName: string = 'F'): Expression[] {
		const vString = `${vName}=[${data.vertices.map((v) =>`(${v.join(',')})`).join(',')}]`;
		const fString = `${fName}=[${data.faces.map((f) =>`(${f.join(',')})`).join(',')}]`;
		return [vString, fString].map((latex) => ({ latex, "hidden": true }));
	}
}

// 使用示例
(async () => {
    const filePath = process.argv[2]; // 从命令行参数获取文件路径
    if (!filePath) {
        console.error('请提供OBJ文件的路径');
        return;
    }
    const outputPathIndex = process.argv.indexOf('-o');
    const outputPath = outputPathIndex !== -1 ? process.argv[outputPathIndex + 1] : null;
	const vNameIndex = process.argv.indexOf('-v');
	const vName = vNameIndex !== -1 ? process.argv[vNameIndex + 1] : 'V';
	const fNameIndex = process.argv.indexOf('-f');
	const fName = fNameIndex !== -1 ? process.argv[fNameIndex + 1] : 'F';

    const parser = new OBJParser();
    try {
        const text = fs.readFileSync(path.resolve(filePath)).toString();
        const data = await parser.parseOBJ(text);
        const expressions = parser.toExpressions(data, vName, fName);
		const json = JSON.stringify(expressions);

        if (outputPath) {
            fs.writeFileSync(outputPath, json);
            console.log(`内容已输出到文件: ${outputPath}`);
        } else {
			console.log(json);
        }
    } catch (error) {
        console.error('解析OBJ文件时出错:', error);
    }
})();

/*

In-Desmos useful console snippets:

// First, create a folder in the expressions list to store the data, with name ("Data" for example).
// Create 2 expressions in the folder as placeholders. They would be where "V" and "F" will be stored.
// Next, paste this line in the console and paste the huge JSON string following it.
exps=
      ^(paste the JSON string here)

// Then, modify these params, then paste & run:
Calc = Calc				// Or whatever the environment is
folderTitle = "Data" 	// Or anything youve used 

// Main code --- paste & run finally
stateExps = Calc.getState().expressions.list
folderId = stateExps.find(e => e.type === "folder" && e.title === folderTitle).id
expIds = stateExps.filter(e => e.folderId === folderId).map(e => e.id).slice(-2)
exps = exps.map((exp, i) => ({...exp, "id": expIds[i]}))
Calc.setExpressions(exps)

*/