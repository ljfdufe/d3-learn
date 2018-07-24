
git push的时候每次都要输入用户名和密码的问题解决

    换了个ssh key,发现每次git push origin master的时候都要输入用户名和密码
    原因是在添加远程库的时候使用了https的方式。。所以每次都要用https的方式push到远程库
    查看使用的传输协议:

git remote -v

wuxiao@wuxiao-C-B150M-K-Pro:~/MyGithub/DailyBlog$ git remote -v
origin https://github.com/toyijiu/DailyBlog.git (fetch)
origin https://github.com/toyijiu/DailyBlog.git (push)

    重新设置成ssh的方式:

git remote rm origin
git remote add origin git@github.com:username/repository.git
git push -u origin master

    再看下当前的传输协议:
    wuxiao@wuxiao-C-B150M-K-Pro:~/MyGithub/DailyBlog$ git remote -v
    origin git@github.com:toyijiu/DailyBlog.git (fetch)
    origin git@github.com:toyijiu/DailyBlog.git (push)


-----------------------
拉取  

先修改  再拉取， 结果这里没变化

------------------------
1、安装git  
2、ssh  
3、pubkey添加到github  
4、就可以push  fetch 了

-----------------------
## d3-format
* d3.timeParse
* d3.timeFormat
> %a：星期的缩写 // Thu  
%A：星期的全称 // Thursday  
%b：月的缩写 // Jan  
%B：月的全称 // January  
%d：在本月的天数， 不足2位用0补全 [01, 31]  
%e：在本月的天数， 不足2位用空格补全 [ 1, 31]  
%b：月的缩写 // Jan  
%B：月的全称 // January  
%d：在本月的天数， 不足2位用0补全 [01, 31]  
%e：在本月的天数， 不足2位用空格补全 [ 1, 31]   
%H：小时， 24小时制 [00, 23]  
%I：小时， 12小时制 [01, 12]  
%j：在本年中的天数 [001, 366]  
%m：月份 [01, 12]  
%M：分钟 [00, 59]  
%L：毫秒 [000, 999]  
%p：AM或PM  
%S：秒 [00, 60]  
%x：日期部分， 等同于”%m%d%Y”  
%X：时间部分， 等同于”%H:%M:%S”  
%y：不含纪元的年份 [00, 99]  
%Y：包含纪年的4位数年份  

* d3.format

--------------
## Left-Aligned Ticks

```javascript
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.svg.axis().scale(x).tickSize(12).tickPadding(-2))
    .selectAll("text")
    .attr("x", 5)
    .attr("dy", null)
    .style("text-anchor", null);
```

--------------
## Sortable Bar Chart
可学习的点
- transition
-------------
## Stacked Bar Chart
可学习点
- 利用scaleLiner 将连续数据映射到颜色
- d3.stack()
- d3.scaleBand 的一些参数含义
- .nice() 使刻度取得“整数”
-------------
## Bivariate-Hexbin-Map
可学习的点
- Promise.all race等
- projecttion 将经纬度 转换为 svg坐标系内的点坐标
-------------
## Heatmap (2D Histogram, CSV)
学习的点
- scale中.tick()的应用
- timeParse, timeFormat 的更多理解
---------------
## Pie Multiples with Nesting
- d3.nest
- selection filter

**Calender View**中的nest更为详细

----------------
## D3 Interactive Streamgraph

数据维度转换

![dataforstack.png](https://upload-images.jianshu.io/upload_images/12926915-1b9f57674513d463.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

stack之后的数据

![stackeddata.png](https://upload-images.jianshu.io/upload_images/12926915-347b1463c86c3132.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

console.log(area(stackeddata[0]))  
看到path d属性，x值nan，说明x轴相关的有问题。

-------------
## The Amazing Pie 
- transition  attrTween
- 插值器一些使用的点

-------------

