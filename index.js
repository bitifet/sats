// index.js
// ========
"use strict";

var Fs = require("fs");

var helpers = {
    notNull: function notNull(x){return x !== null;},
    pickPaths: function pickPaths(nodeList, pathList){
        if (nodeList === null) return [];
        if (pathList === undefined) pathList = [];
        for (let i = 0; i < nodeList.length; i++){
            pathList[pathList.length] = nodeList[i].path;
            helpers.pickPaths(nodeList[i].contents, pathList);
        };
        return pathList;
    },
    smartCbk: function(pattern, options){
        if (pattern === undefined) return;
        if (typeof pattern == "string") {
            if (typeof options != "string") options = "";
            pattern = new RegExp("^"+pattern.replace(/[*?]/g, function(w){
                return (w == "*") ? ".*?" : ".?";
            })+"$", options);
        };
        if (pattern instanceof RegExp) {
            return function regexpCbk(n){
                return (n.stat.isDirectory() && n.contents.length) || n.name.match(pattern);
            };
        };

    },
};

function nodeScanner(path, cbk, options){
    if (typeof cbk !== "function") cbk = helpers.smartCbk(cbk, options);
    return function scanNode(fileName){
        return new Promise(function(resolve,reject){
            var fullPath=path+"/"+fileName;
            Fs.stat(fullPath,function(err,stat){
                if(err) return reject(err);
                (stat.isDirectory()
                    ? scanPath(fullPath, cbk)
                    : Promise.resolve(null)
                ).then(function(contents){
                    var node = {
                        name: fileName,
                        path: fullPath,
                        stat: stat,
                        contents: contents,
                    };
                    resolve((!cbk || cbk(node)) ? node : null);
                }).catch(reject);
            });
        });
    };
};

function scanPath(path, cbk, options){
    return new Promise(function(resolve,reject){
        Fs.readdir(path, function(err, data){
            if(err) return reject(err);
            Promise.all(data.map(nodeScanner(path, cbk, options))).then(function(nodes){
                resolve(nodes.filter(helpers.notNull));
            }).catch(reject);
        });
    });
};

function find(path, cbk, options){
    return new Promise(function(resolve, reject){
        scanPath(path, cbk, options).then(function(tree){
            resolve(helpers.pickPaths(tree));
        }).catch(reject);
    });
};

module.exports = {
    scan: scanPath,
    find: find,
};

