---
category: 教程
order: 9
title: 编译tqapi
------

本教程示范如何编译tqapi的C++库、Java库和Python库。

## Linux

示范如何在ubuntu 16.04上编译。其他Linux与此类似。

### 安装编译工具

先安装git, gcc, cmake，如果要编译java版本，还需要安装 jdk。

```shell
$ sudo apt-get install git cmake g++ openjdk-8-jdk
```

### 从github下载源代码。

```
user@dev:~/tmp$ git clone https://github.com/acqusta/tqapi.git
user@dev:~/tmp$ git clone https://github.com/acqusta/tqapi.git
Cloning into 'tqapi'...
remote: Counting objects: 2395, done.
remote: Compressing objects: 100% (15/15), done.
remote: Total 2395 (delta 5), reused 11 (delta 5), pack-reused 2375
Receiving objects: 100% (2395/2395), 2.05 MiB | 336.00 KiB/s, done.
Resolving deltas: 100% (1128/1128), done.
Checking connectivity... done.
```
也可以直接下载源码解开使用。https://github.com/acqusta/tqapi/archive/master.zip 

### 使用cmake创建工程，然后编译

```
user@dev:~/tmp$ cd tqapi
$ mkdir build
$ cd build
$ cmake .. -DCMAKE_BUILD_TYPE=Release
-- The C compiler identification is GNU 5.4.0
-- The CXX compiler identification is GNU 5.4.0
. . .
-- Generating done
-- Build files have been written to: /home/user/tmp/tqapi/build
$ make install
Scanning dependencies of target msgpack
[  4%] Building C object lib/msgpack/CMakeFiles/msgpack.dir/src/objectc.c.o
[  8%] Building C object lib/msgpack/CMakeFiles/msgpack.dir/src/unpack.c.o
[ 12%] Building C object lib/msgpack/CMakeFiles/msgpack.dir/src/version.c.o
. . .
[100%] Built target tqapi_test

```
### 安装

C++的头文件和库安装在当前目录的dist目录中。

```
user@dev:~/tmp/tqapi/build$ make install
[ 25%] Built target msgpack
[ 62%] Built target myutils
[ 83%] Built target snappy
[ 91%] Built target tqapi-static
[100%] Built target tqapi_test
Install the project...
-- Install configuration: ""
-- Installing: /home/user/tmp/tqapi/build/dist/bin/tqapi_test
-- Set runtime path of "dist/bin/tqapi_test" to ""
-- Installing: /home/user/tmp/tqapi/build/dist/lib/libtqapi-static.a
-- Up-to-date: /home/user/tmp/tqapi/build/dist/cpp/tquant_api.h

user@dev:~/tmp/tqapi/build$ find dist/
dist/
dist/bin
dist/bin/tqapi_test
dist/cpp
dist/cpp/tquant_api.h
dist/lib
dist/lib/libtqapi-static.a
```

### 编译Java库和JNI库

在使用CMake生成项目工程时，加参数 -DBUILD_JAVA=1 , 然后编译安装，步骤如前面。

```
user@dev:~/tmp/tqapi/build$ cmake .. -DCMAKE_BUILD_TYPE=Release -DBUILD_JAVA=1
-- The C compiler identification is GNU 5.4.0
-- The CXX compiler identification is GNU 5.4.0
-- Check for working C compiler: /usr/bin/cc
-- Check for working C compiler: /usr/bin/cc -- works
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Detecting C compile features
-- Detecting C compile features - done
-- Check for working CXX compiler: /usr/bin/c++
-- Check for working CXX compiler: /usr/bin/c++ -- works
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- Configuring done
-- Generating done
-- Build files have been written to: /home/user/tmp/tqapi/build
```

jar文件和jni库在dist/java目录中。如下所示。

```
user@dev:~/tmp/tqapi/build$ find dist/java
dist/java
dist/java/tqapi.jar
dist/java/libtqapi_jni.so

```

### 编译安装Python库

可以使用pip从pip的仓库中安装。也可以从下载的源码中安装。

在tqapi源码目录中，执行如下命令。注意不是在build目录中。先安装pandas，setuptools依赖包，再安装模块。

```
user@dev:~/tmp/tqapi$ pip install pandas setuptools
user@dev:~/tmp/tqapi$ python setup.py install

```

## Windows

Windows上编译和Linux类似，安装工具 git, cmake, Visual Studio 2015或以上。注意根据需要选择win32版本或者X64版本。

如果不是使用C++版本，建议直接下载编译好的java包或Python包。

