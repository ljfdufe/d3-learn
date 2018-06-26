学习d3所写的东西

涉及的
1. webpack
2. yarn
3. d3

try ssh key

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



-------------------------------------------------------------------------
拉取
--------------------------------------
先修改  再拉取， 结果这里没变化
--------------------------------------



1、安装git
2、ssh
3、pubkey添加到github
4、就可以push  fetch 了