       'use strict';

       var React = require('react/addons');

       // CSS-
       require('normalize.css');
       require('../styles/main.scss');

       //获取图片相关的信息
       var imageDatas = require('../data/imageDatas.json');

       //利用自执行函数，将图片名信息转成图片URL路径信息
       (function genImageURL(imageDatasArr) {
           for (var i = 0, j = imageDatasArr.length; i < j; i++) {
               var singleImageData = imageDatasArr[i];

               singleImageData.imageURL = require('../images/' + singleImageData.fileName);

               imageDatasArr[i] = singleImageData;
           }

           return imageDatasArr;
       })(imageDatas);

       function getRangeRandom(low, high) {
           return Math.ceil(Math.random() * (high - low) + low);
       }

       function get30DegRandom() {
           //获取0到30度之间的任意正负值
           return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
       }
       /////////////////////////////////////ImageFigure/////////////////////////////////////////////////////////
       //建立单个图片的框架      遍历图片json 把数据加到图片里面去  用一个集合把他们抱起来
var ImageFigure = React.createClass({

    /*
     * imgFigure 的点击处理函数
     */
    handleClick: function (e) {
  if (this.props.arrange.isCenter) {
    this.props.inverse();
  }else{
    this.props.center();
  }

      e.stopPropagation();
      e.preventDefault();
    },

    render: function () {

        var styleObj = {};

        // 如果props属性中指定了这张图片的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        // 如果图片的旋转角度有值并且不为0， 添加旋转角度
        if (this.props.arrange.rotate) {
          (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
            styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
          }.bind(this));
        }

        // 如果是居中的图片， z-index设为11
        if (this.props.arrange.isCenter) {
          styleObj.zIndex = 11;
        }

        var imgFigureClassName = 'img-figure';
            imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageURL}
                     alt={this.props.data.title}
                />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                      <p>
                        {this.props.data.desc}
                      </p>
                    </div>
                </figcaption>
            </figure>
        );
    }
});
       ////////////////////////////GalleryByReactApp/////////////////////////////////////////////////////////////////
       var GalleryByReactApp = React.createClass({
                   Constant: {
                       centerPos: {
                           left: 0,
                           right: 0
                       },
                       hPosRange: { //水平方向的取值范围
                           leftSecX: [0, 0],
                           rightSecX: [0, 0],
                           y: [0, 0]
                       },
                       vPosRange: {
                           x: [0, 0],
                           topY: [0, 0]
                       }

                   },

                   //翻转图片
                   inverse: function(index) {
                       return function() {
                           var imgsArrangArr = this.state.imgsArrangArr;
                           imgsArrangArr[index].isInverse = !imgsArrangArr[index].isInverse;
                           this.setState({
                               imgsArrangArr: imgsArrangArr
                           });
                       }.bind(this);

                   },



                   rearrange: function(centerIndex) {
                       ///////生成一个图片信息组
                       /////获得随机值，利用，随机随机值
                       ////////从图片信息组拿出一个来
                       ////将随机的随机值放到图片信息组
                       var imgsArrangArr = this.state.imgsArrangArr,
                           Constant = this.Constant,
                           centerPos = Constant.centerPos,
                           hPosRange = Constant.hPosRange,
                           vPosRange = Constant.vPosRange,
                           hPosRangeLeftSecX = hPosRange.leftSecX,
                           hPosRangeRightSecX = hPosRange.rightSecX,
                           hPosRangeY = hPosRange.y,
                           vPosRangeTopY = vPosRange.topY,
                           vPosRangeX = vPosRange.x,
                           imgsArrangTopArr = [],
                           topImgNum = Math.floor(Math.random() * 2),
                           topImgSpliceIndex = 0,
                           imgsArrangArrCenterArr = imgsArrangArr.splice(centerIndex, 1);
                       /////////////用constant赋值中心位置img数组
                       imgsArrangArrCenterArr[0] = {
                           pos: centerPos,
                           rotate: 0,
                           isCenter: true
                       };


                       //拿到上侧要显示的那张图片
                       topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangArr.length - topImgNum));
                       imgsArrangTopArr = imgsArrangArr.splice(topImgSpliceIndex, topImgNum);
                       //随机它的位置
                       imgsArrangTopArr.forEach(function(value, index) {
                           imgsArrangTopArr[index] = {
                               pos: {
                                   top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                                   left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])

                               },
                               rotate: get30DegRandom(),
                               isCenter: false

                           };
                       });
                       //布局左右两侧的图片
                       for (var i = 0, j = imgsArrangArr.length, k = j / 2; i < j; i++) {
                           var hPosRangeLORX = null;
                           if (i < k) {
                               hPosRangeLORX = hPosRangeLeftSecX;
                           } else {
                               hPosRangeLORX = hPosRangeRightSecX;
                           }
                           ////////////////////////随机给他们位置/////////////////////////////////////
                           imgsArrangArr[i] = {
                               pos: {
                                   top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                                   left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                               },
                               rotate: get30DegRandom(),
                               isCenter: false



                           };
                       }
                       if (imgsArrangTopArr && imgsArrangTopArr[0]) {
                           imgsArrangArr.splice(topImgSpliceIndex, 0, imgsArrangTopArr[0]);
                       }
                       imgsArrangArr.splice(centerIndex, 0, imgsArrangArrCenterArr[0]);

                       this.setState({
                           imgsArrangArr: imgsArrangArr
                       });
                   },
                   center: function(index) {
                       return function() {
                           this.rearrange(index);
                       }.bind(this);
                   },

                   getInitialState: function() {
                       return {
                           imgsArrangArr: [
                               /*{
        			pos:{left: '0',top:'0'},
        rotate:0,
        isInverse: false,     //正反面
        isCenter:false}*/
                           ]
                       };
                   },


                   //组件加载以后，为每张图片计算其位置的范围
                   componentDidMount: function() {
                       //////////获得出舞台和图片的宽和高
                       var stageDOM = React.findDOMNode(this.refs.stage),
                           stageW = stageDOM.scrollWidth,
                           stageH = stageDOM.scrollHeight,
                           halfStageW = Math.ceil(stageW / 2),
                           halfStageH = Math.ceil(stageH / 2);

                       var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),

                           imgW = imgFigureDOM.scrollWidth,
                           imgH = imgFigureDOM.scrollHeight,
                           halfImgW = Math.ceil(imgW / 2),
                           halfImgH = Math.ceil(imgH / 2);
                       /////上中心图片的取值范围///////////////
                       this.Constant.centerPos = {
                           left: halfStageW - halfImgW,
                           top: halfStageH - halfImgH
                       };
                       //////上侧图片的取值范围////////////////
                       this.Constant.vPosRange.topY[0] = -halfImgH;
                       this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
                       this.Constant.vPosRange.x[0] = halfStageW - imgW;
                       this.Constant.vPosRange.x[1] = halfStageW;
                       ///////左侧，右侧的取值范围//
                       this.Constant.hPosRange.leftSecX[0] = -halfImgW;
                       this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
                       this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
                       this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
                       this.Constant.hPosRange.y[0] = -halfImgH;
                       this.Constant.hPosRange.y[1] = stageH - halfImgH;

                       this.rearrange(0);
                   },


                   render: function() {
                       var controllerUnits = [],
                           imageFigures = [];

imageDatas.forEach(function (value, index) {

        if (!this.state.imgsArrangArr[index]) {
            this.state.imgsArrangArr[index] = {
                pos: {
                    left: 0,
                    top: 0
                },
                rotate: 0,
                isInverse: false,
                isCenter: false
            };
        }
                               imageFigures.push( < ImageFigure key = { index }
                                   data = { value }
                                   arrange = {
                                       this.state.imgsArrangArr[index]
                                   }
                                   inverse={this.inverse(index)}


                                   ref = { 'imgFigure' + index }
                                   center = { this.center(index) }
                                   />);

                               }.bind(this));


                           return ( < section className = "stage"
                               ref = "stage" >
                               < section className = "img-sec" > { imageFigures } < /section> < nav className = "controller-nav" > { controllerUnits } < /nav > < /section>
                           );
                       }
                   }); React.render( < GalleryByReactApp / >, document.getElementById('content')); // jshint ignore:line

               module.exports = GalleryByReactApp;
