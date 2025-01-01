// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Utils {

    public static sendPostRequest(url: string,
        data: object,
        callback: (error: Error | null, response: any | null) => void) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        callback(null, response);
                    } catch (error) {
                        callback(new Error("Failed to parse response JSON"), null);
                    }
                } else {
                    callback(new Error(`Request failed with status ${xhr.status}: ${xhr.statusText}`), null);
                }
            }
        };
        xhr.onerror = function () {
            const errorDetails = `Network error on URL ${url}. Status: ${xhr.status} (${xhr.statusText || "Unknown error"})`;
            console.error(errorDetails);

            // Pass error details to the callback
            callback(new Error(errorDetails), null);
        };
        // Send JSON data
        xhr.send(JSON.stringify(data));
    }
    public static getQueryParam(url: string, param: string): string | null {
        const urlObj = new URL(url);
        return urlObj.searchParams.get(param);
    }
    public static openURL(url) {
        window.open(url, "_self");
    }
}
