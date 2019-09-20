/*
 *  compile
 *  解析页面节点，
 *  new watcher改变node.textContent就可以
 */
function Compile(el, vm){
    this.vm = vm
    this.el = document.querySelector(el)
    this.fragment = null
    this.init()
}
Compile.prototype = {
    init: function(){
        if(this.el){
            this.fragment = this.nodeToFragment(this.el) // 生成节点片段,非dom
            this.compileElement(this.fragment)
            this.el.appendChild(this.fragment); // 为什么fragment又add到el中, fragment非dom元素

        }else{
            console.log("dom节点不存在");
        }
    },
    nodeToFragment: function(el){
        console.log('node');
        var fragment = document.createDocumentFragment()
        var child = el.firstChild
        while(child){
            fragment.appendChild(child)
            child = el.firstChild
        }
        return fragment
    },
    compileElement: function(el){
        var childs = el.childNodes; // 这是fragme中的
        var self = this;
        var reg = /\{\{\s*(.*?)\s*\}\}/;
        [].slice.call(childs).forEach(function(node){
            var text = node.textContent
            if(self.isTextNode(node) && reg.test(text)){
                self.compileText(node, reg.exec(text)[1]) //
            }
            if(node.childNodes && node.childNodes.length){
                self.compileElement(node) //递归
            }
        })
    },
    compileText: function(node, exp){
        var self = this
        var initText = this.vm[exp]
        this.updateText(node, initText)
        // watcher
        new Watcher(this.vm, exp, function(value){
            self.updateText(node, value)
        })
    },
    updateText: function(node, value){
        node.textContent = typeof value == 'undefined' ? '' : value
    },
    isTextNode: function(node){
        return node.nodeType == 3
    }
}
