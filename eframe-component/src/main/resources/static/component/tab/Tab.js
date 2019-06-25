/**
 * tab 标签页
 */
define(function(require, exports, module) {
    var $ = require('jquery'),
        _ = require('lodash'),
        Base = require('../Base'),
        format = require('objectformat');

    var mainTpl = require('./template/main.html'),
        liTpl = require('./template/li.html'),
        divTpl = require('./template/div.html'),
        iframeTpl = require('./template/iframe.html');

    // 基于基类--调用基类的监听
    var Tab = Base.extend({
      // 必须重写constructor，修改this指向，指向Tab,要不然后面的this都没有定义
      constructor: function(options){
        Tab.superclass.constructor.call(this, options)
        this.initialize(options)
      },
      // 初始化
      initialize: function(options){
        this.el = $(options.el)
        this.view = options.view
        var sourceConfig = options.config || []
        this.config = _.uniq(sourceConfig, 'id')  // 保证id唯一
        this.events = options.events
        this.modCache = {} // ★ {id: {path: '', loaded: false,  options: {}, refresh: false, modObj: '子模块实例' } }
      },
      // render
      render: function(){
        this.el.html(mainTpl)
        this._renderContent()
        this._bindEvents()
      },

    })
    // _renderContent
    Tab.prototype._renderContent =  function(){
      var liArr = [],
          divArr = [],
          config = this.config,
          liHtml,
          divHtml,
          activeIndex = _.findIndex(config, function(_c){
            return _c.active === true
          })
      activeIndex = activeIndex < 0 ? 0 : activeIndex // 没写active,默认第一个active
      var activeChild = null // 当前模块的id和参数

      _.each(config, function(conf, index){
        var _id = conf.id,
            _child = conf.child
        var _isAct = index === activeIndex  // 判断当前索引和active:true所有在位置是否一致，进而确认active:true的位置
        var _activeStr = _isAct ? 'active' : ''
        this.modCache[_id] = {
          loaded: _isAct
        }
        if(_isAct){ // 判断active:true的对应的id和child
          activeChild = {
            id: _id,
            child: _child
          }
        }
        if(_child){  // 处理modCache, 渲染子模块时候不用重新请求require，只要refresh
          this.modCache[_id].path = _child.path
          this.modCache[_id].options = _child.options || {}
          this.modCache[_id].refresh = _child.refresh || false
        }
        // 渲染li
        liHtml = format(liTpl, {
            id: conf.id,
            title: conf.title,
            active: _activeStr // 如果each索引值和activeIndex一致的话，就是当前加active
        })
        liArr.push(liHtml)
        // 渲染div
        divHtml =  format(divTpl, {
            id: conf.id,
            active: _activeStr
        })
        divArr.push(divHtml)

      }, this)
      this.el.find('>ul').html(liArr.join(''))
      this.el.find('>div').html(divArr.join(''))

      // 默认渲染active:true的子模块,其他tab对应的内容不加载
      if(activeChild){
        this._renderChild(activeChild.id, activeChild.child)
      }

      //渲染样式风格 line
      if(this.view === 'line'){
        this.el.addClass('tabbable-line')
        this.el.find('>.nav-tabs').addClass('second_tab')
      }

    }
    // _renderChild
    Tab.prototype._renderChild =  function(id, child){
      var _this = this
      if(child){ // 第一个判断: child是undefined
        if(this.modCache[id] && this.modCache[id].modObj){ // 第二判断: 是否已经初始化过，有缓存和子模块实例
          console.log("已有子模块实例, 不重新require.async");
          if(this.modCache[id].refresh === true){  // 第三判断: 是否有refresh属性标签
            var modObj = this.modCache[id].modObj
            if(modObj.refresh){ // 第四判断: 子模块是否有refresh()方法，如果没有销毁后 重新渲染
              modObj.refresh()
            }else{
              if(modObj.dispose){ // 第五判断: 是否有销毁函数
                modObj.dispose()
              }
              modObj.render()
            }
          }
        }else{
          // 首次加载子模块
          console.log("首次加载，没有子模块实例");
          var childPath = child.path
          if(childPath){ // 判断有子模块: 有子模块路径
            require.async(childPath, function(ChildMod){
              var opt = {
                el: "#" + id
              }
              var options = child.options  // 之前初始化的时候已经存在了
              if(_.isFunction(options)){  //  刚刚执行后才生成的options
                // options: function(){ return {name: 'aaa'}}支持动态传参的方式, 当首次切换到该tab时，动态获取当前的参数
                options = options()
              }
              _.extend(opt, options || {} )
              var cm = new ChildMod(opt)
              cm.render()
              _this.modCache[id].modObj = cm
            })
          }

        }

      }else{
        console.log("没有child");
      }

    }

    // _isSameActive
    Tab.prototype._isSameActive =  function(id){
      var curId = this.el.find('.xyz_tab_content.active').attr('id')
      if(curId === id){
        return true
      }
      return false
    }
    // _active切换显示，假设已经执行了事件
    Tab.prototype._active =  function(id){
        if(this._isSameActive(id)){
          return
        }
        this.el.find('.xyz_tab_li.active').removeClass('active')
        this.el.find('.xyz_tab_content.active').removeClass('active')
        this.el.find('.xyz_tab_li[li_id = ' + id + ']').addClass('active')
        this.el.find('.xyz_tab_content#' + id).addClass('active')

    }
    // _bindEvent
    Tab.prototype._bindEvents =  function(){
      var _this = this
      // 事件绑定
      if(this.events){
        _.each(this.events, function(fn, key){
          this.on(key, fn, this)
        }, this)
      }

      // 点击标签页
      this.el.find("ul>li").on("click", function(e){
        e.preventDefault();   //阻止url上的hash, 即a标签上的 href="#tab1"
        if($(this).hasClass('active')){
          return false
        }
        var liId = $(this).attr("li_id")
        //true: 执行_renderChild, false: 只是切换display的显示隐藏，初始化必须为true，因为内容还没加载
        _this.activeById(liId, true);
      })
    }
    // 切换
    Tab.prototype.activeById =  function(_id, self){
      if(this._isSameActive(_id)){ // _id可能外部传递过来的，不是li点击的
        return
      }
      var _this = this,
          events = this.events,
          beforeChange = events.beforeChange
      var changeCallback = function(){
        // 如果beforeChange在events中没有定义，且self为false，那么只是切换display，不做render
        if(!beforeChange && !self){
          _this._active(_id)
        }
        // 定时渲染
        var inter = setInterval(function(){
            if($('#' + _id).css('display') !== 'none'){
                clearInterval(inter);  // 切换后div显示，不执行inter
            }
            var cacheObj = _this.modCache[_id];
            _this._renderChild(_id, cacheObj);
            _this.emit('change', _id, _this);
        }, 10);

      }
      // 如果有钱
      if(beforeChange){
          beforeChange(_id, function(){
              _this._active(_id);
              changeCallback();
          }, _this);
          return false;
      } else {
          changeCallback();
      }

    }
    Tab.prototype._isModule = function(path) {
        return !(_.contains(path, '.jsp') || _.contains(path, '.html') || _.contains(path, 'http://') || _.contains(path, 'https://'));
    };
    module.exports = Tab;
});
