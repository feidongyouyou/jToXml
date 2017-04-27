var data = {
    "nodes":[
        {
            "w":120,
            "h":80,
            "left":329,
            "top":-25,
            "text":"start",
            "id":"00",
            "menuText":"欢迎致电",
            "type":"greetingMenu"
        },
        {
            "w":120,
            "h":80,
            "left":329,
            "top":93,
            "text":"voicemenu",
            "id":"0",
            "menuText":"业务1请按1,业务2请按2",
            "type":"voicemenu"
        },
        {
            "w":120,
            "h":80,
            "left":163,
            "top":215,
            "text":"voicemenu",
            "id":"01",
            "menuText":"业务11请按1，业务22请按2",
            "type":"voicemenu"
        },

        {
            "w":120,
            "h":80,
            "left":552,
            "top":213,
            "text":"voicemenu",
            "id":"02",
            "menuText":"业务21请按1，业务22请按2",
            "type":"voicemenu"
        },
        {
            "w": 120,
            "h": 80,
            "left": 65,
            "top": 397,
            "text": "transferAgent",
            "id": "011",
            "menuText": "转接中，请稍候",
            "agentGroup": "1",
            "businessType": "4",
            "type": "transferAgent"
        },
        {
            "w":120,
            "h":80,
            "left":264,
            "top":397,
            "text":"transferAgent",
            "id":"012",
            "menuText":"转接中，请稍候",
            "agentGroup":"1",
            "businessType":"4",
            "type":"transferAgent"
        },
        {
            "w":120,
            "h":80,
            "left":440,
            "top":397,
            "text":"transferAgent",
            "id":"021",
            "menuText":"转接中，请稍候",
            "agentGroup":"1",
            "businessType":"4",
            "type":"transferAgent"
        },
        {
            "w":120,
            "h":80,
            "left":655,
            "top":394,
            "text":"transferAgent",
            "id":"022",
            "menuText":"转接中，请稍候",
            "agentGroup":"1",
            "businessType":"4",
            "type":"transferAgent"
        }
    ],
    "edges":[
        {
            "source":"00",
            "target":"0",
            "data":{
                "label":"",
                "id":"00-0",
                "type":"default"
            }
        },
        {
            "source":"0",
            "target":"01",
            "data":{
                "label":"1",
                "id":"0-01",
                "type":"connection"
            }
        },
        {
            "source":"0",
            "target":"02",
            "data":{
                "label":"2",
                "id":"0-02",
                "type":"connection"
            }
        },
        {
            "source":"01",
            "target":"011",
            "data":{
                "label":"1",
                "id":"01-011",
                "type":"connection"
            }
        },
        {
            "source":"01",
            "target":"012",
            "data":{
                "label":"2",
                "id":"01-012",
                "type":"connection"
            }
        },

        {
            "source":"02",
            "target":"021",
            "data":{
                "label":"1",
                "id":"02-021",
                "type":"connection"
            }
        },
        {
            "source":"02",
            "target":"022",
            "data":{
                "label":"2",
                "id":"02-022",
                "type":"connection"
            }
        }

    ]
};

function JsonToXml() {
    this.result = [];
}
JsonToXml.prototype.spacialChars = ["&","<",">","\"","'"];
JsonToXml.prototype.validChars = ["&","<",">","\"","'"];
JsonToXml.prototype.toString = function(){
    return this.result.join("");
};
JsonToXml.prototype.replaceSpecialChar = function(s){
    for(var i=0;i<this.spacialChars.length;i++){
        s=s.replace(new RegExp(this.spacialChars[i],"g"),this.validChars[i]);
    }
    return s;
};
JsonToXml.prototype.appendText = function(s){
    s = this.replaceSpecialChar(s);
    this.result.push(s);
};
JsonToXml.prototype.appendAttr = function(key, value){
    this.result.push(" "+ key +"=\""+ value +"\"");
    // this.result.push("<" + key + ">" + value + "</" + key + ">");
};
JsonToXml.prototype.appendFlagBeginS = function(s){
    this.result.push("<"+s);
};
JsonToXml.prototype.appendFlagBeginE = function(){
    this.result.push(">");
};
JsonToXml.prototype.appendFlagEnd = function(s){
    this.result.push("</"+s+">");
};
JsonToXml.prototype.parse = function(json){
    // this.appendFlagBeginS("IVRFlow");
    // this.appendFlagBeginE();
    this.convert(json);
    // this.appendFlagEnd("IVRFlow");
    return "<IVRFlow>"+this.toString()+"</IVRFlow>";
};
// for(var j = 0; j < data.edges.length; j++) {
//     console.log(data.edges.source);
// }

JsonToXml.prototype.convert = function(obj) {
    for(var key in obj) {
    // var k = "nodes";
        if(key == "edges")  continue;
        var item = obj[key];
        if(key == "nodes"){
            key = "menu";
        }
        // if(key == "edges") {
        //     key = "branch";
        // }
        if(key == "target"){
            key = "targetMenu";
        }
        // alert(obj.edges.targetMenu);
        if(key == "source"){
            key = "dtmf";


        }

        if(item.constructor == String) {
            this.appendAttr(key, item);
        }
        if(item.constructor == Array){
            for(var i = 0; i < item.length; i++){
                // alert(item[i].type);
                this.appendFlagBeginS(key);
                this.convert(item[i]);
                if(item[i].type == "greetingMenu"){
                    for (var m = 0; m < obj.edges.length; m++) {
                        // alert(obj.edges[m].target);
                        if (obj.edges[m].source == item[i].id) {
                            this.appendAttr("startMenu", obj.edges[m].target);
                        }
                    }
                }
                this.appendFlagBeginE();

                if(item[i].type == "voicemenu") {
                    for (var j = 0; j < obj.edges.length; j++) {

                        if (obj.edges[j].source == item[i].id) {
                            var str = obj.edges[j].target;
                            obj.edges[j].source = str.charAt(str.length-1);
                            this.appendFlagBeginS("branch");
                            this.convert(obj.edges[j]);
                            this.appendFlagBeginE();
                            this.appendFlagEnd("branch");
                        }
                    }
                }
                // for(var j = 0; j < item.length; j++){
                //     // alert(item[j].source);
                //     if(item[j].source == item[i].id){
                //         this.convert(item[j]);
                //     }
                // }
                this.appendFlagEnd(key);

            }

        }
    }
};



// var data = {	"tools": [	{ "name":"css format" , "site":"http://www.jsons.cn/" },	{ "name":"json format" , "site":"http://www.jsons.cn/" },	{ "name":"hash MD5" , "site":"http://www.jsons.cn/" }	]	};
// var data = {"nodes":[{"hoho":"bfbf"},{"dkvdl":"dbdb"}],"dhdj":[{"mdvgdl":"cxv"},{"vdgd":"fbhf"}]};
// var json = {	"tools": [	{ "name":"css format" , "site":"http://www.jsons.cn/" },	{ "name":"json format" , "site":"http://www.jsons.cn/" },	{ "name":"hash MD5" , "site":"http://www.jsons.cn/" }	]	}

var jsonParser = new JsonToXml();
var xml = jsonParser.parse(data);
// var elements = document.getElementsByTagName("edges");
// for(var h = 0; h < )
// elements.parentNode.removeChild(elements);
console.log(xml);/**
 * Created by Administrator on 2017/4/19.
 */
/**
 * Created by Administrator on 2017/4/20.
 */
