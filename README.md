SATS - Simple Async Tree Scanner
================================

> Not always most optimal, but simple to use asynchronous filesystem tree scanner.


<a name="Brief"></a>Brief
-------------------------

Non-blocking filesystem tree scanner. Allows to easily find files or directorys accross deep directory structure picking for desired patterns or properties.

Always returns a promise resolving with desired data.

### Example:

Searching for ".ini" files case insensitive.

```javascript
    var Tree = require("sats");
    
    Tree.find("/path/to/dir", "*.ini", "i").then(function(files){

        // FIXME: Parent directory names should now be manually discarded.
        //        This will be fixed in a future version (see TODO below).
        files = files.filter(function(f){return f.match(/.+\.ini$/i);});
        
        // Do something with files full path list.

    });
```



<a name="Brief"></a>Methods
---------------------------

### scan

Recursively scan given path.

Resolves an array of nodes (files and subdirectorys): with the below structure:


```javascript
    {
        name: "File name",
        path: "Full path (including file name)",
        stat: { /* File stat data */ },
        contents: { /* Subdirectory contents or null in case of regular file. */ },
    }
```


#### Syntax

```javascript
    scan(path, filter, options)
```

Where...


##### path

Is the full path to the directory to scan.

#### filter

Is an (Optional) filtering function, regular expression or string to allow or reject nodes (and its contents in case of directorys) in the tree.

Valid filter types are:

**string:** File name pattern (with '\*' and '?' wilcards allowed). Files should match. Directorys are discarded only if no matchings inside (recursively).

**RegExp:** Like string, but using regular expression.

**function:** Function receiving the full node and returning true (to accept) or false (to discard) each node. This is the most powerful option, but you should manually take care of not discarding directorys if you want to recursively match file names even if parent directory names doesn't match.


#### options

Additional options like "i" for case insensitive matching in case of RegExp or string (same as RegExp) filter.


### find

Just like scan(), but it resolves to flat array with the full path of all results.


#### Syntax

```javascript
    find(path, filter, options)
```


<a name="todo"></a>TODO
-----------------------

  * Enable distinction of display and recursion in filtering function to allow not returning parent directory nodes in find output.



<a name="contributing"></a>Contributing
---------------------------------------

If you are interested in contributing with this project, you can do it in many ways:

  * Creating and/or mantainig documentation.

  * Implementing new features or improving code implementation.

  * Reporting bugs and/or fixing it.
  
  * Sending me any other feedback.

  * Whatever you like...
    
Please, contact-me, open issues or send pull-requests thought [this project GIT repository](https://github.com/bitifet/sats)

