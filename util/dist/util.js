"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTDValidate = exports.getInitiateMain = void 0;
const ajv_1 = __importDefault(require("ajv"));
const node_child_process_1 = require("node:child_process");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const getInitiateMain = (mainCmd, cmdArgs) => {
    return new Promise((resolve, reject) => {
        const thingProcess = (0, node_child_process_1.spawn)(mainCmd, cmdArgs);
        const timeout = setTimeout(() => {
            reject(new Error("Thing did not start as expected."));
        }, 1000);
        thingProcess.stdout.on("data", (data) => {
            if (data.toString().includes("ThingIsReady")) {
                clearTimeout(timeout);
                resolve({
                    process: thingProcess,
                    message: "Success",
                });
            }
        });
        thingProcess.stderr.on("data", (data) => {
            reject(new Error(`Process stderr: ${data}`));
        });
        thingProcess.on("error", (error) => {
            reject(new Error(`Process error: ${error.message}`));
        });
        thingProcess.on("close", () => {
            reject(new Error("Failed to initiate the main script."));
        });
    });
};
exports.getInitiateMain = getInitiateMain;
const ajv = new ajv_1.default({ strict: false, allErrors: true, validateFormats: false });
const getTDValidate = async () => {
    const packageJsonPath = require.resolve("wot-thing-description-types/package.json");
    const schemaPath = node_path_1.default.join(node_path_1.default.dirname(packageJsonPath), "schema", "td-json-schema-validation.json");
    const tdSchema = JSON.parse(node_fs_1.default.readFileSync(schemaPath, "utf-8"));
    return Promise.resolve({
        validate: ajv.compile(tdSchema),
        message: "Success",
    });
};
exports.getTDValidate = getTDValidate;
//# sourceMappingURL=util.js.map