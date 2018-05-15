import * as Papa from 'papaparse'
import { Intent } from './Intent';
import { JsonIntent } from './JsonModels/JsonIntent';
import * as fs from 'fs';
import { JsonExpression } from './JsonModels/Expression';
import { Expression } from './Expression';

async function PapaparsePromise(dir: string, jsonExpression: JsonExpression, expressions: Array<Expression>) {
    return new Promise((resolve, reject) => {
        Papa.parse(fs.createReadStream(dir + "/" + jsonExpression.file), {
            worker: true,
            header: false,
            skipEmptyLines: true,
            step: function (results, parser) {
                console.log("Parsing expression: " + results.data);
                let expression = {
                    source: results.data.toString(),
                    language: {
                        isocode: jsonExpression.language
                    },
                };
                expressions.push(expression);
            },
            complete: function (results, file) {
                console.log("Parsing complete on file " + file);
                resolve();
            },
            error: function (err, file) {
                console.log("Error: " + err + " on file " + file);
                reject();
            }
        });
    });
}

export async function initIntent(obj: JsonIntent, dir: string) {
    let intentObj = new Intent(obj.name, obj.description);
    for (let it of obj.expressions) {
        await PapaparsePromise(dir, it, intentObj.expressions);
    }
    return intentObj;
}

export async function initExpressions(obj: JsonIntent, dir: string) {
    let expressions: Expression[] = [];
    for (let it of obj.expressions) {
        await PapaparsePromise(dir, it, expressions);
    }
    return expressions;
}