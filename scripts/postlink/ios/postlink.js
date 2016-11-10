var fs = require("fs");
var glob = require("glob");
var inquirer = require('inquirer');
var path = require("path");
var plist = require("plist");

var ignoreNodeModules = { ignore: "node_modules/**" };
var appDelegatePath = glob.sync("**/AppDelegate.m", ignoreNodeModules)[0];
// Glob only allows foward slashes in patterns: https://www.npmjs.com/package/glob#windows
var plistPath = glob.sync(path.join(path.dirname(appDelegatePath), "*Info.plist").replace(/\\/g, "/"), ignoreNodeModules)[0];

var appDelegateContents = fs.readFileSync(appDelegatePath, "utf8");
var plistContents = fs.readFileSync(plistPath, "utf8");

// 1. Add the header import statement
var MartianRnAlipayHeaderImportStatement = `#import "MartianRnAlipay.h"`;
if (~appDelegateContents.indexOf(MartianRnAlipayHeaderImportStatement)) {
    console.log(`"MartianRnAlipay.h" header already imported.`);
} else {
    var appDelegateHeaderImportStatement = `#import "AppDelegate.h"`;
    appDelegateContents = appDelegateContents.replace(appDelegateHeaderImportStatement,
        `${appDelegateHeaderImportStatement}\n${MartianRnAlipayHeaderImportStatement}`);
}

// 2. Connect AlipayDelegate to AppDelegate
var appEndStatement = appDelegateContents.match(/(@end)\n/)[1]; //todo too risky
var alipayDelegateAssignmentStatement = '[MartianRnAlipay aliPayParse:url];';
if (~appDelegateContents.indexOf(alipayDelegateAssignmentStatement)) {
    console.log(`AlipayDelegate already connected AppDelegate.`);
} else {
    var alipayDelegatePatch = `
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString*, id> *)options
{
  //如果极简开发包不可用,会跳转支付宝钱包进行支付,需要将支付宝钱包的支付结果回传给开 发包
  [MartianRnAlipay aliPayParse:url];
  return YES;
}`;
    appDelegateContents = appDelegateContents.replace(appEndStatement,
        `${alipayDelegatePatch}\n\n${appEndStatement}`);
}


writePatches();
function writePatches() {
    fs.writeFileSync(appDelegatePath, appDelegateContents);
    // fs.writeFileSync(plistPath, plistContents);
}