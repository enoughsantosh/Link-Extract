function unPack(code) {
    function indent(code) {
        try {
            var tabs = 0, old = -1, add = '';
            for(var i = 0; i < code.length; i++) {
                if(code[i].indexOf("{") != -1) tabs++;
                if(code[i].indexOf("}") != -1) tabs--;

                if(old != tabs) {
                    old = tabs;
                    add = "";
                    while (old > 0) {
                        add += "\t";
                        old--;
                    }
                    old = tabs;
                }
                code[i] = add + code[i];
            }
        } finally {
            tabs = null;
            old = null;
            add = null;
        }
        return code;
    }

    var env = {
        eval: function (c) {
            code = c;
        },
        window: {},
        document: {}
    };

    eval("with(env) {" + code + "}");

    code = (code+"").replace(/;/g, ";\n").replace(/{/g, "\n{\n").replace(/}/g, "\n}\n").replace(/\n;\n/g, ";\n").replace(/\n\n/g, "\n");
    code = code.split("\n");
    code = indent(code);
    return code.join("\n");
}

module.exports = (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).send('No code provided');
    }
    
    try {
        const unpacked = unPack(code);
        res.status(200).send(unpacked);
    } catch (error) {
        res.status(500).send('Error unpacking code: ' + error.message);
    }
};
